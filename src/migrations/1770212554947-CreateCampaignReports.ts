import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCampaignReports1770212554947 implements MigrationInterface {
  name = 'CreateCampaignReports1770212554947';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    await queryRunner.query(
      `CREATE TABLE "campaign_reports" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "campaign" character varying NOT NULL, "campaign_id" character varying NOT NULL, "adgroup" character varying NOT NULL, "adgroup_id" character varying NOT NULL, "ad" character varying NOT NULL, "ad_id" character varying NOT NULL, "client_id" character varying NOT NULL, "event_name" character varying NOT NULL, "event_time" TIMESTAMP WITH TIME ZONE NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d4f9d11076c9b736d3e1473b32f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_campaign_reports_event_time_client_id_event_name" ON "campaign_reports" ("event_time", "client_id", "event_name") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."UQ_campaign_reports_event_time_client_id_event_name"`,
    );
    await queryRunner.query(`DROP TABLE "campaign_reports"`);
  }
}
