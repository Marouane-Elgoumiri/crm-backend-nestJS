export class CreateDataDto {
  readonly Title: string;
  readonly Phone: string;
  readonly Fax: number;
  readonly Website: string;
  readonly Address: string;
  readonly Activity: string;
  readonly Manager: string;

}

export class UpdateDataDto {
  readonly Title?: string;
  readonly Phone?: string;
  readonly Fax?: string;
  readonly Website?: string;
  readonly Address?: string;
  readonly Activity?: string;
  readonly Manager?: string;

}

// Title', 'Phone', 'Fax','Website','Address', 'Activity', 'Manager'