import { Tabs, TabsContent, TabsList, TabsTrigger } from "@godui/components";

export function TabsDemo() {
  return (
    <Tabs defaultValue="account" className="w-full max-w-sm">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>
      <TabsContent value="account" className="rounded-lg border p-4 text-sm">
        Make changes to your account here.
      </TabsContent>
      <TabsContent value="password" className="rounded-lg border p-4 text-sm">
        Change your password here.
      </TabsContent>
      <TabsContent
        value="notifications"
        className="rounded-lg border p-4 text-sm"
      >
        Choose what you want to be notified about.
      </TabsContent>
    </Tabs>
  );
}
