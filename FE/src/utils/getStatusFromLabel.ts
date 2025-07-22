import { StatusLabel, StatusValue } from './StatusEnum';

export const getStatusFromLabel = (status?: string): StatusValue => {  
  switch (status?.toLowerCase()) {
    case StatusLabel.APPROVED:
      return StatusValue.SUCCESS;
    case StatusLabel.REJECTED:
      return StatusValue.FAILED;
    case StatusLabel.PENDING:
      return StatusValue.PROGRESS;
    case StatusLabel.INREVIEW:
      return StatusValue.INREVIEW;  
    case StatusLabel.RESUBMITTED:
      return StatusValue.RESUBMITTED;
    default:
      return StatusValue.INFO;
  }
};
