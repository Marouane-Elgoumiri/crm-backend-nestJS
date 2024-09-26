import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

@Schema()
export class Data extends Document {
  @Prop()
  Title: string;

  @Prop()
  Phone: string;

  @Prop()
  Fax: string;

  @Prop()
  Website: string;

  @Prop()
  Address: string;

  @Prop()
  Activity: string;

  @Prop()
  Manager: string;


  // 'Title', 'Phone', 'Fax','Website','Address', 'Activity', 'Manager'
}

export const DataSchema = SchemaFactory.createForClass(Data);

