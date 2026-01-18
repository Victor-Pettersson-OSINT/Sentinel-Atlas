import { Module } from "@nestjs/common";
import { AuditModule } from "../audit/audit.module";
import { PrismaModule } from "../prisma/prisma.module";
import { ModerationService } from "./moderation.service";

@Module({
  imports: [PrismaModule, AuditModule],
  providers: [ModerationService],
  exports: [ModerationService],
})
export class ModerationModule {}
