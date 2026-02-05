import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('campaign_reports')
@Index(
  'UQ_campaign_reports_event_time_client_id_event_name',
  ['event_time', 'client_id', 'event_name'],
  { unique: true },
)
export class CampaignReportEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  campaign: string;

  @Column({ type: 'varchar' })
  campaign_id: string;

  @Column({ type: 'varchar' })
  adgroup: string;

  @Column({ type: 'varchar' })
  adgroup_id: string;

  @Column({ type: 'varchar' })
  ad: string;

  @Column({ type: 'varchar' })
  ad_id: string;

  @Column({ type: 'varchar' })
  client_id: string;

  @Column({ type: 'varchar' })
  event_name: string;

  @Column({ type: 'timestamptz' })
  event_time: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
