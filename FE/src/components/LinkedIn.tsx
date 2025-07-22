import React from 'react';
import CardLayout from './CardLayout';
import searchIcon from '../assets/images/search-icon.png';
import generateIcon from '../assets/images/settings.jpg';
import { Button } from 'UI-Library';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  linkedinText: yup.string().required('Text is required').min(10, 'Minimum 10 characters required'),
});

const LinkedIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = (data: any) => {
    console.log('Submitted:', data);
  };
  return (
    <div className="linkedScreen">
      <CardLayout>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="linked-in-container">
            <div className="linked-in-card">
              <div className="card-title">
                <span className="search-icon">{/* <img src={searchIcon} alt="search" /> */}</span>
                <span>Keywords</span>
              </div>
              <div className="linked-filed">
                <div className="linked-in-input">
                  <textarea
                    {...register('linkedinText')}
                    name="linkedinText"
                    id="linked-in"
                    cols={100}
                    rows={10}
                    placeholder="Enter your text"
                  ></textarea>
                  {errors.linkedinText && (
                    <p className="linked-in-textarea">{errors.linkedinText.message}</p>
                  )}
                </div>
                <div className="linked-in-generate">
                  <Button label="Generate" type="submit" className="generate-btn" />
                </div>
                <div className="linked-in-output">
                  <div className="linked-in-outcome"></div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </CardLayout>
    </div>
  );
};

export default LinkedIn;
