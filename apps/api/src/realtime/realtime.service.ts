import { Injectable } from "@nestjs/common";
import type { SubmissionStatus } from "@prisma/client";
import { RealtimeGateway } from "./realtime.gateway";

export type LiveSubmissionEvent = {
  id: string;
  title: string;
  status: SubmissionStatus;
  country: string;
  regionId?: string | null;
  createdAt: string;
};

@Injectable()
export class RealtimeService {
  constructor(private readonly gateway: RealtimeGateway) {}

  broadcastNewSubmission(event: LiveSubmissionEvent) {
    this.gateway.broadcast("submission:new", event);
  }
}
