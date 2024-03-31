"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChangePassword from "./change_password";
import ForgotPassword from "./forgot-password";
export default function TabsDemo() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Tabs defaultValue="account" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="account">Change password</TabsTrigger>
          <TabsTrigger value="password">Forgot Password</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>
                Change your password here. After saving, you'll be logged out.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <ChangePassword />
            </CardContent>
            <CardFooter></CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="password">
          <Card>
            <CardContent className="space-y-2">
              <ForgotPassword />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
