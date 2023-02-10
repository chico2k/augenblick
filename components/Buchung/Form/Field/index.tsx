import React, { InputHTMLAttributes } from 'react';
import { Field } from 'formik';
import { ExclamationCircleIcon } from '@heroicons/react/outline';

interface IFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  fieldName: string;
  textArea?: boolean;
  label: string;
}

const ContactFields: React.FC<IFieldProps> = ({
  fieldName,
  textArea,
  label,
  ...props
}) => {
  return (
    <Field>
      {({
        form: { handleChange, handleBlur, errors, touched, values },
      }: any) => {
        return (
          <div>
            <div className='flex justify-between'>
              <label
                htmlFor={fieldName}
                className={`block text-sm font-medium text-gray-900 ${
                  errors[fieldName] && touched[fieldName] ? 'text-red-600' : ''
                }`}
              >
                {label.charAt(0).toUpperCase() + label.slice(1)}
              </label>
              <p className='text-sm text-red-600' id='email-error'>
                {errors[fieldName] && touched[fieldName]
                  ? errors[fieldName]
                  : ''}
              </p>
            </div>
            <div className='mt-1 relative rounded-md shadow-sm'>
              {textArea ? (
                <textarea
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values[fieldName]}
                  id={fieldName}
                  name={fieldName}
                  rows={4}
                  className={`
                  ${
                    errors[fieldName] && touched[fieldName]
                      ? 'border border-red-600 placeholder-red-300'
                      : 'border-white '
                  }
                  block w-full px-4 py-3 rounded-md border-2 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-300 focus:ring-offset-gray-900`}
                />
              ) : (
                <input
                  {...props}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values[fieldName]}
                  id={fieldName}
                  name={fieldName}
                  className={`
                ${
                  errors[fieldName] && touched[fieldName]
                    ? 'border border-red-600 placeholder-red-300'
                    : 'border-white '
                }
                py-3 px-4 block w-full shadow-lg shadow-indigo-300/20  text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 border border-gray-300 rounded-md              `}
                />
              )}
              <div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
                {errors[fieldName] && touched[fieldName] ? (
                  <ExclamationCircleIcon
                    className='h-5 w-5 text-red-500'
                    aria-hidden='true'
                  />
                ) : null}
              </div>
            </div>
          </div>
        );
      }}
    </Field>
  );
};

export default ContactFields;
