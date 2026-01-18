import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { AuditModule } from "./audit/audit.module";
import { CuratedFlowsModule } from "./curated-flows/curated-flows.module";
import { ModerationModule } from "./moderation/moderation.module";
import { PrismaModule } from "./prisma/prisma.module";
import { RealtimeModule } from "./realtime/realtime.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    AuditModule,
    CuratedFlowsModule,
    ModerationModule,
    RealtimeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
