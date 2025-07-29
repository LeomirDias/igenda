"use client";

import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { CalendarDays } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface DailyAppointment {
  date: string;
  appointments: number;
  revenue: number | null;
}

interface AppointmentsChartProps {
  dailyAppointmentsData: DailyAppointment[];
}

export function AppointmentsChart({
  dailyAppointmentsData,
}: AppointmentsChartProps) {
  dayjs.locale("pt-br");
  const chartDays = Array.from({ length: 21 }).map((_, i) =>
    dayjs()
      .subtract(10 - i, "days")
      .format("YYYY-MM-DD"),
  );

  const chartData = chartDays.map((date) => {
    const dataForDay = dailyAppointmentsData.find((item) => item.date === date);
    return {
      date: dayjs(date).format("DD/MM"),
      fullDate: date,
      appointments: dataForDay?.appointments || 0,
    };
  });

  const chartConfig = {
    appointments: {
      label: "Agendamentos",
      color: "#0B68F7",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <CalendarDays className="text-muted-foreground h-6 w-6" />
        <div className="flex w-full flex-row items-center justify-between">
          <CardTitle className="text-lg">Agendamentos</CardTitle>
          <CardDescription className="text-xs">
            Total de agendamentos para os últimos 21 dias
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="overflow-hidden">
        <ChartContainer
          config={chartConfig}
          className="min-h-[200px] sm:min-h-[250px]"
        >
          <AreaChart
            data={chartData}
            margin={{
              top: 20,
              right: 5,
              left: 5,
              bottom: 5,
            }}
            className="w-full"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              fontSize={11}
              interval="preserveStartEnd"
              minTickGap={5}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              fontSize={11}
              width={30}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => {
                    return (
                      <>
                        <div className="h-3 w-3 rounded bg-[#0B68F7]" />
                        <span className="text-muted-foreground">
                          Agendamentos:
                        </span>
                        <span className="font-semibold">{value}</span>
                      </>
                    );
                  }}
                  labelFormatter={(label, payload) => {
                    if (payload && payload[0]) {
                      return dayjs(payload[0].payload?.fullDate)
                        .format("DD/MM/YYYY (dddd)")
                        .replace(/^(.)/, (c) => c.toUpperCase());
                    }
                    return label;
                  }}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="appointments"
              stroke="var(--color-appointments)"
              fill="var(--color-appointments)"
              fillOpacity={0.2}
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
