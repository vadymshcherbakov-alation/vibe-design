export type WorkflowStep = {
  id: string;
  icon?: React.ComponentType<{ size?: number }>;
  label: string;
  secondaryText?: string;
  inputParameters?: Array<{
    name: string;
    type: string;
    description: string;
  }>;
  outputParameters?: Array<{
    name: string;
    type: string;
    description: string;
  }>;
};
