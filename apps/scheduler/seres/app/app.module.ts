import { Module } from "@nestjs/common";
import { GraphQLModule } from "seres/graphql/graphql.module";
import { PrismaModule } from "seres/prisma/prisma.module";
import { SchedulerModule } from "seres/scheduler/scheduler.module";
import { AppService } from "./app.service";


@Module({
    imports: [GraphQLModule, SchedulerModule, PrismaModule],
    providers: [AppService],
})

export class AppModule {}