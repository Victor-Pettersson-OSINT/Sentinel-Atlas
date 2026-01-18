import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class CuratedFlowsService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.curatedFlow.findMany({
      where: { enabled: true },
      include: { tags: { include: { tag: true } } },
      orderBy: [{ priority: "desc" }, { order: "asc" }],
    });
  }

  create(data: {
    name: string;
    regionId?: string;
    country?: string;
    priority?: number;
    isAutoTrending?: boolean;
    createdById?: string;
  }) {
    return this.prisma.curatedFlow.create({
      data: {
        name: data.name,
        regionId: data.regionId,
        country: data.country,
        priority: data.priority ?? 0,
        isAutoTrending: data.isAutoTrending ?? false,
        createdById: data.createdById,
      },
    });
  }

  update(flowId: string, data: Partial<{
    name: string;
    regionId: string | null;
    country: string | null;
    priority: number;
    isAutoTrending: boolean;
    enabled: boolean;
    order: number;
  }>) {
    return this.prisma.curatedFlow.update({
      where: { id: flowId },
      data,
    });
  }
}
