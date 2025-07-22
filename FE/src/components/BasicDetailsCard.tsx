import { Card } from 'UI-Library';
import Edit from './images/Edit';

import { BasicDetailsCardProps } from '../interfaces/components';

const BasicDetailsCard = ({ basicDetailsData }: BasicDetailsCardProps) => {
  return (
    <Card
      title="Basic Details"
      Icons={<Edit />}
      cardClass="rent-detail"
      cardHeaderClass="card-header"
    >
      <div className="card-head">
        <h6>{basicDetailsData.landlordName}</h6>
        <p>{basicDetailsData.address}</p>
      </div>
      <div className="card-detail">
        <div className="detail">
          <p>Rent Amount</p>
          <span>{basicDetailsData.rentAmount}</span>
        </div>
        <div className="detail due-date">
          <p>Due Date</p>
          <span>{basicDetailsData.dueDate}</span>
        </div>
      </div>
      <div className="card-detail">
        <div className="detail">
          <p>Contact</p>
          <span>{basicDetailsData.contact}</span>
        </div>
        <div className="detail">
          <p>Email</p>
          <span>{basicDetailsData.email}</span>
        </div>
      </div>
    </Card>
  );
};

export default BasicDetailsCard;
