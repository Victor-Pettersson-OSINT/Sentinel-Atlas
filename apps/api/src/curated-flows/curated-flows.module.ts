import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { CuratedFlowsService } from "./curated-flows.service";

@Module({
  imports: [PrismaModule],
  providers: [CuratedFlowsService],
  exports: [CuratedFlowsService],
})
export class CuratedFlowsModule {}
