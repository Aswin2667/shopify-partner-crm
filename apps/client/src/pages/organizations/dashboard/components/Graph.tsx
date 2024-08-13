"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
const chartData = [
  { date: "2024-04-01", shopJar: 222, Retainful: 150 },
  { date: "2024-04-02", shopJar: 97, Retainful: 180 },
  { date: "2024-04-03", shopJar: 167, Retainful: 120 },
  { date: "2024-04-04", shopJar: 242, Retainful: 260 },
  { date: "2024-04-05", shopJar: 373, Retainful: 290 },
  { date: "2024-04-06", shopJar: 301, Retainful: 340 },
  { date: "2024-04-07", shopJar: 245, Retainful: 180 },
  { date: "2024-04-08", shopJar: 409, Retainful: 320 },
  { date: "2024-04-09", shopJar: 59, Retainful: 110 },
  { date: "2024-04-10", shopJar: 261, Retainful: 190 },
  { date: "2024-04-11", shopJar: 327, Retainful: 350 },
  { date: "2024-04-12", shopJar: 292, Retainful: 210 },
  { date: "2024-04-13", shopJar: 342, Retainful: 380 },
  { date: "2024-04-14", shopJar: 137, Retainful: 220 },
  { date: "2024-04-15", shopJar: 120, Retainful: 170 },
  { date: "2024-04-16", shopJar: 138, Retainful: 190 },
  { date: "2024-04-17", shopJar: 446, Retainful: 360 },
  { date: "2024-04-18", shopJar: 364, Retainful: 410 },
  { date: "2024-04-19", shopJar: 243, Retainful: 180 },
  { date: "2024-04-20", shopJar: 89, Retainful: 150 },
  { date: "2024-04-21", shopJar: 137, Retainful: 200 },
  { date: "2024-04-22", shopJar: 224, Retainful: 170 },
  { date: "2024-04-23", shopJar: 138, Retainful: 230 },
  { date: "2024-04-24", shopJar: 387, Retainful: 290 },
  { date: "2024-04-25", shopJar: 215, Retainful: 250 },
  { date: "2024-04-26", shopJar: 75, Retainful: 130 },
  { date: "2024-04-27", shopJar: 383, Retainful: 420 },
  { date: "2024-04-28", shopJar: 122, Retainful: 180 },
  { date: "2024-04-29", shopJar: 315, Retainful: 240 },
  { date: "2024-04-30", shopJar: 454, Retainful: 380 },
  { date: "2024-05-01", shopJar: 165, Retainful: 220 },
  { date: "2024-05-02", shopJar: 293, Retainful: 310 },
  { date: "2024-05-03", shopJar: 247, Retainful: 190 },
  { date: "2024-05-04", shopJar: 385, Retainful: 420 },
  { date: "2024-05-05", shopJar: 481, Retainful: 390 },
  { date: "2024-05-06", shopJar: 498, Retainful: 520 },
  { date: "2024-05-07", shopJar: 388, Retainful: 300 },
  { date: "2024-05-08", shopJar: 149, Retainful: 210 },
  { date: "2024-05-09", shopJar: 227, Retainful: 180 },
  { date: "2024-05-10", shopJar: 293, Retainful: 330 },
  { date: "2024-05-11", shopJar: 335, Retainful: 270 },
  { date: "2024-05-12", shopJar: 197, Retainful: 240 },
  { date: "2024-05-13", shopJar: 197, Retainful: 160 },
  { date: "2024-05-14", shopJar: 448, Retainful: 490 },
  { date: "2024-05-15", shopJar: 473, Retainful: 380 },
  { date: "2024-05-16", shopJar: 338, Retainful: 400 },
  { date: "2024-05-17", shopJar: 499, Retainful: 420 },
  { date: "2024-05-18", shopJar: 315, Retainful: 350 },
  { date: "2024-05-19", shopJar: 235, Retainful: 180 },
  { date: "2024-05-20", shopJar: 177, Retainful: 230 },
  { date: "2024-05-21", shopJar: 82, Retainful: 140 },
  { date: "2024-05-22", shopJar: 81, Retainful: 120 },
  { date: "2024-05-23", shopJar: 252, Retainful: 290 },
  { date: "2024-05-24", shopJar: 294, Retainful: 220 },
  { date: "2024-05-25", shopJar: 201, Retainful: 250 },
  { date: "2024-05-26", shopJar: 213, Retainful: 170 },
  { date: "2024-05-27", shopJar: 420, Retainful: 460 },
  { date: "2024-05-28", shopJar: 233, Retainful: 190 },
  { date: "2024-05-29", shopJar: 78, Retainful: 130 },
  { date: "2024-05-30", shopJar: 340, Retainful: 280 },
  { date: "2024-05-31", shopJar: 178, Retainful: 230 },
  { date: "2024-06-01", shopJar: 178, Retainful: 200 },
  { date: "2024-06-02", shopJar: 470, Retainful: 410 },
  { date: "2024-06-03", shopJar: 103, Retainful: 160 },
  { date: "2024-06-04", shopJar: 439, Retainful: 380 },
  { date: "2024-06-05", shopJar: 88, Retainful: 140 },
  { date: "2024-06-06", shopJar: 294, Retainful: 250 },
  { date: "2024-06-07", shopJar: 323, Retainful: 370 },
  { date: "2024-06-08", shopJar: 385, Retainful: 320 },
  { date: "2024-06-09", shopJar: 438, Retainful: 480 },
  { date: "2024-06-10", shopJar: 155, Retainful: 200 },
  { date: "2024-06-11", shopJar: 92, Retainful: 150 },
  { date: "2024-06-12", shopJar: 492, Retainful: 420 },
  { date: "2024-06-13", shopJar: 81, Retainful: 130 },
  { date: "2024-06-14", shopJar: 426, Retainful: 380 },
  { date: "2024-06-15", shopJar: 307, Retainful: 350 },
  { date: "2024-06-16", shopJar: 371, Retainful: 310 },
  { date: "2024-06-17", shopJar: 475, Retainful: 520 },
  { date: "2024-06-18", shopJar: 107, Retainful: 170 },
  { date: "2024-06-19", shopJar: 341, Retainful: 290 },
  { date: "2024-06-20", shopJar: 408, Retainful: 450 },
  { date: "2024-06-21", shopJar: 169, Retainful: 210 },
  { date: "2024-06-22", shopJar: 317, Retainful: 270 },
  { date: "2024-06-23", shopJar: 480, Retainful: 530 },
  { date: "2024-06-24", shopJar: 132, Retainful: 180 },
  { date: "2024-06-25", shopJar: 141, Retainful: 190 },
  { date: "2024-06-26", shopJar: 434, Retainful: 380 },
  { date: "2024-06-27", shopJar: 448, Retainful: 490 },
  { date: "2024-06-28", shopJar: 149, Retainful: 200 },
  { date: "2024-06-29", shopJar: 103, Retainful: 160 },
  { date: "2024-06-30", shopJar: 446, Retainful: 400 },
]

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  shopJar: {
    label: "shopJar",
    color: "hsl(var(--chart-1))",
  },
  Retainful: {
    label: "Retainful",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function Graph() {
  const [timeRange, setTimeRange] = React.useState("90d")

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const now = new Date()
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    now.setDate(now.getDate() - daysToSubtract)
    return date >= now
  })

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>App Analytics</CardTitle>
          <CardDescription>
            Showing total Installation for the last 3 months
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillshopJar" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-shopJar)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-shopJar)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillRetainful" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-Retainful)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-Retainful)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="Retainful"
              type="natural"
              fill="url(#fillRetainful)"
              stroke="var(--color-Retainful)"
              stackId="a"
            />
            <Area
              dataKey="shopJar"
              type="natural"
              fill="url(#fillshopJar)"
              stroke="var(--color-shopJar)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
