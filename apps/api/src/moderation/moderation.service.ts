import { Injectable } from "@nestjs/common";
import { SubmissionStatus, WorkflowLevel } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { AuditService } from "../audit/audit.service";

@Injectable()
export class ModerationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService
  ) {}

  async approve(submissionId: string, actorId?: string, reason?: string) {
    const updated = await this.prisma.submission.update({
      where: { id: submissionId },
      data: {
        status: SubmissionStatus.approved,
      },
    });

    await this.prisma.moderationAction.create({
      data: {
        submissionId,
        actorId: actorId ?? null,
        action: "approve",
        level: updated.currentLevel,
        reason: reason ?? null,
      },
    });

    await this.auditService.logEvent({
      actorId,
      action: "submission.approve",
      entityType: "submission",
      entityId: submissionId,
      metadata: { reason },
    });

    return updated;
  }

  async reject(submissionId: string, actorId?: string, reason?: string) {
    const updated = await this.prisma.submission.update({
      where: { id: submissionId },
      data: {
        status: SubmissionStatus.rejected,
      },
    });

    await this.prisma.moderationAction.create({
      data: {
        submissionId,
        actorId: actorId ?? null,
        action: "reject",
        level: updated.currentLevel,
        reason: reason ?? null,
      },
    });

    await this.auditService.logEvent({
      actorId,
      action: "submission.reject",
      entityType: "submission",
      entityId: submissionId,
      metadata: { reason },
    });

    return updated;
  }

  async escalate(
    submissionId: string,
    actorId?: string,
    reason?: string
  ) {
    const submission = await this.prisma.submission.findUnique({
      where: { id: submissionId },
    });

    if (!submission) {
      throw new Error("Submission not found");
    }

    const nextLevel = this.nextLevel(submission.currentLevel);

    const updated = await this.prisma.submission.update({
      where: { id: submissionId },
      data: {
        status: SubmissionStatus.escalated,
        currentLevel: nextLevel,
      },
    });

    await this.prisma.moderationAction.create({
      data: {
        submissionId,
        actorId: actorId ?? null,
        action: "escalate",
        level: submission.currentLevel,
        reason: reason ?? null,
      },
    });

    await this.auditService.logEvent({
      actorId,
      action: "submission.escalate",
      entityType: "submission",
      entityId: submissionId,
      metadata: { from: submission.currentLevel, to: nextLevel, reason },
    });

    return updated;
  }

  private nextLevel(level: WorkflowLevel): WorkflowLevel {
    switch (level) {
      case WorkflowLevel.regional:
        return WorkflowLevel.nordic;
      case WorkflowLevel.nordic:
        return WorkflowLevel.european;
      case WorkflowLevel.european:
        return WorkflowLevel.global;
      default:
        return WorkflowLevel.global;
    }
  }
}
