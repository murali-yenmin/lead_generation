import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button, Card, Input } from 'UI-Library';
import linkedIn from '../../assets/images/linked-in-icon.jpeg';
import CardLayout from '../../components/CardLayout';
import { socialMediaDatas } from '../../utils/menus/socialMedia';
import { Link, Outlet } from 'react-router-dom';

const Dashboard = () => {
  return (
    <>
      <div className="social-medias-container">
        {socialMediaDatas.map((item) => (
          <CardLayout>
            <Link to={item?.title.toLowerCase()} className="card-link">
              <div className="card-box">
                <div className="icon">
                  <img src={item?.img} alt={item?.title} />
                </div>
                <h1>{item?.title}</h1>
              </div>
            </Link>
          </CardLayout>
        ))}
      </div>
    </>
  );
};

export default Dashboard;
