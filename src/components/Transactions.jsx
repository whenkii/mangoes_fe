import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { config } from "./reactConfig";
import DynamicForm from "./DynamicForm";
import { dbConfigContext } from "../contexts/dbConfigContext";
import { accountsContext } from "../contexts/accountsContext";
import { AllSpinners } from "./Spinners";

export default function TransactionsForm() {
  const [formLoaded, setFormLoaded] = useState(false);
  const [formSchema, setFormSchema] = useState({});
  const [configData, configLoading] = useContext(dbConfigContext);
  const [accountInfo] = useContext(accountsContext);

  const varFormName = "LOG_TRANSACTIONS_FORM";
  const query = `SELECT firstname || ', ' || lastname AS user_name, email FROM users WHERE type LIKE 'admin'`;

  // Fetch config and user data
  useEffect(() => {
    if (!configData || configLoading) return;

    const formConfig = configData.find(item => item.NAME === varFormName);
    if (!formConfig) {
      alert(`Form config "${varFormName}" not found in DB`);
      return;
    }

    let parsedSchema;
    try {
      parsedSchema = JSON.parse(formConfig.JSON_STRING);
    } catch (e) {
      alert("Invalid JSON in config");
      console.error(e);
      return;
    }

    // Fetch admin user list
    axios.get(`${config.restAPIserver}:${config.restAPIHost}/api/getSqlresult/${query}`)
      .then(({ data }) => {
        const names = data.rows.map(user => ({
          value: user.EMAIL,
          label: user.USER_NAME,
        }));
        // Inject options into src/tgt fields
        const updatedFields = parsedSchema.fields.map(field =>
          ['src', 'tgt'].includes(field.name)
            ? { ...field, options: names }
            : field
        );

        setFormSchema({
          ...parsedSchema,
          fields: updatedFields,
          added_by: accountInfo.email,
        });

        setFormLoaded(true);
      })
      .catch(error => {
        alert("Couldn't fetch user list:\n" + error);
      });
  }, [configData, configLoading, accountInfo.email,query]);

  if (!formLoaded || configLoading) {
    return <AllSpinners />;
  }

  return (
    <div>
      <DynamicForm formSchema={formSchema} />
    </div>
  );
}