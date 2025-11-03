"use client";
import Docs from "@/lib/axios/document";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import formSchema from "@/lib/zod/UploadFile";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import LoginLooading from "@/components/loading/login";
import { Input } from "@/components/ui/input";
import { Button } from "@radix-ui/themes";
import { Button as Btn } from "../ui/button";
import Swal from "sweetalert2";
import { useState } from "react";
type FormValues = {
  title: string;
  description: string;
  file: File | null; // Change the type of 'file' to File | null
};

type UploadProps = { id: any; qr: any; onClose?: () => void };

export default function UploadDocument(data: UploadProps) {
  // console.log(data)
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      file: null,
    },
  });

  async function onSubmit(values: FormValues) {
    // Handle form submission here
    // console.log(values)
    setLoading(true);
    const rs: any = await Docs.UploadPdf(data?.id, values);
    if (rs.success) {
      Swal.fire({
        title: rs.mess,
        timer: 2000,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      // .then((result) => {
      //   /* Read more about handling dismissals below */
      //   if (result.dismiss === Swal.DismissReason.timer) {
      //     router.push("/teacher/course");
      //   }
      // });
    } else {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Your process has been failed!",
        showConfirmButton: false,
        timer: 1500,
      });
    }
    setLoading(false);
    data?.qr.refetch();
  }

  return (
    <div className="flex mt-5">
      <Card>
        <CardHeader>
          <CardTitle></CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="file"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload file</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        placeholder="..."
                        onChange={(e: any) => {
                          field.onChange(e.target.files[0]);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {loading ? (
                <LoginLooading />
              ) : (
                <div className="flex items-center gap-3">
                  <Button type="submit" variant="surface">
                    Submit
                  </Button>
                  {data?.onClose && (
                    <Btn onClick={data.onClose} variant="outline" className="text-red-700 hover:text-red-500">
                      Close
                    </Btn>
                  )}
                </div>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
