"use client"
import * as React from "react";
import { Label } from "@/components/ui/label";
import { type CarouselApi } from "@/components/ui/carousel"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function CarouselDemo() {
  const [currentSlide, setCurrentSlide] = useState<any>(0);
  const data = {
    title: "Test Quiz",
    description: "This is a sample quiz for demonstration purposes.",
    start_date: "2024-04-15T09:00:00Z",
    end_date: "2024-04-15T12:00:00Z",
    time_limit: 60,
    factor: 1.5,
    questions: [
      {
        content: "What is the capital of France?",
        options: ["Paris", "London", "Berlin", "Madrid"],
        answer: "Paris",
      },
      {
        content: "Which planet is known as the Red Planet?",
        options: ["Earth", "Mars", "Venus", "Jupiter"],
        answer: "Mars",
      },
      {
        content: "What is the chemical symbol for water?",
        options: ["H2O", "CO2", "NaCl", "O2"],
        answer: "H2O",
      },
      {
        content: "What is the chemical symbol for water?",
        options: ["H2O", "CO2", "NaCl", "O2"],
        answer: "H2O",
      },
      {
        content: "What is the chemical symbol for water?",
        options: ["H2O", "CO2", "NaCl", "O2"],
        answer: "H2O",
      },
      {
        content: "What is the chemical symbol for water?",
        options: ["H2O", "CO2", "NaCl", "O2"],
        answer: "H2O",
      }
    ],
    documentSectionId: "6157e4b978b5ba001f5d4e14", // ID của phần tài liệu liên quan
  };

  const handleQuestionClick = (index: number) => {
    setCurrentSlide(index);
  };

  const [api, setApi] = React.useState<CarouselApi>();

  React.useEffect(() => {
    if (!api) {
      return;
    }

    api.scrollTo(currentSlide);
  }, [api, currentSlide]);

  return (
    <div className="flex justify-center flex-col items-center">
      <p>{data.title}</p>
      <div className="flex gap-5 mt-5">
        <Carousel className="w-full max-w-xs" setApi={setApi}>
          <CarouselContent defaultValue={1}>
            {data?.questions.map((el: any, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card>
                    <CardHeader>{index + 1} - {el?.content}</CardHeader>
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                      <RadioGroup>
                        {el?.options.map((m: any, index: any) => (
                          <div className="flex items-center space-x-2" key={index}>
                            <RadioGroupItem
                              value={m}
                              id={index}
                            />
                            <Label htmlFor={m}>{m}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        <div className="grid grid-cols-5 gap-4 place-content-start">
          {data?.questions.map((el: any, index: number) => (
            <Button key={index} onClick={() => handleQuestionClick(index)}>
              {index + 1}
            </Button>
          ))}
          </div>
      </div>
    </div>
  );
}
