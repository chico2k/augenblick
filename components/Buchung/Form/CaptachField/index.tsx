import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Field } from 'formik';

const ReCAPTCHA = dynamic(() => import('react-google-recaptcha'));

const ReCAPTCHAComponent = ({ touched }: { touched: any }) => {
  const [recaptchaNeeded, setRecaptchaNeeded] = useState(false);

  console.log('touched', touched);
  console.log('recaptchaNeeded', recaptchaNeeded);

  useEffect(() => {
    const hasKeys = !!Object.keys(touched).length;

    if (hasKeys) setRecaptchaNeeded(true);
    if (!hasKeys) setRecaptchaNeeded(false);
  }, [touched]);

  return (
    <Field>
      {({ form: { setFieldValue } }: any) => {
        if (!recaptchaNeeded) return null;
        return (
          <div>
            <ReCAPTCHA
              sitekey='6LePoBsgAAAAANy765Nz0Jl4gtYgXsJego5D8nHT'
              onChange={() => setFieldValue('robot', false)}
              theme={'light'}
            />
          </div>
        );
      }}
    </Field>
  );
};

export default ReCAPTCHAComponent;
