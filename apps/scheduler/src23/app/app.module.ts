import { Module } from "@nestjs/common";
import { PrismaModule } from "src23/prisma/prisma.module";
import { AppService } from "./app.service";


@Module({
    imports: [PrismaModule],
    providers: [AppService],
})

export class AppModule {}