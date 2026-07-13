/**
 * Structured logger utility.
 * In production, this can hook directly into services like Sentry, LogRocket, or Datadog.
 */

type LogLevel = "info" | "warn" | "error" | "debug";

interface LogPayload {
  message: string;
  context?: string;
  metadata?: Record<string, any>;
  error?: Error | any;
}

class Logger {
  private formatLog(level: LogLevel, payload: LogPayload) {
    const timestamp = new Date().toISOString();
    return {
      timestamp,
      level: level.toUpperCase(),
      message: payload.message,
      context: payload.context || "application",
      metadata: payload.metadata || {},
      error: payload.error ? {
        name: payload.error.name,
        message: payload.error.message,
        stack: payload.error.stack,
      } : undefined,
    };
  }

  private sendToConsole(level: LogLevel, data: any) {
    const logStr = `[${data.timestamp}] [${data.level}] [${data.context}] ${data.message}`;
    if (level === "error") {
      console.error(logStr, data.error || "", data.metadata);
    } else if (level === "warn") {
      console.warn(logStr, data.metadata);
    } else if (level === "debug") {
      if (process.env.NODE_ENV === "development") {
        console.debug(logStr, data.metadata);
      }
    } else {
      console.log(logStr, data.metadata);
    }
  }

  info(message: string, context?: string, metadata?: Record<string, any>) {
    const formatted = this.formatLog("info", { message, context, metadata });
    this.sendToConsole("info", formatted);
  }

  warn(message: string, context?: string, metadata?: Record<string, any>) {
    const formatted = this.formatLog("warn", { message, context, metadata });
    this.sendToConsole("warn", formatted);
  }

  error(message: string, error?: Error | any, context?: string, metadata?: Record<string, any>) {
    const formatted = this.formatLog("error", { message, error, context, metadata });
    this.sendToConsole("error", formatted);
  }

  debug(message: string, context?: string, metadata?: Record<string, any>) {
    const formatted = this.formatLog("debug", { message, context, metadata });
    this.sendToConsole("debug", formatted);
  }
}

export const logger = new Logger();
export default logger;
