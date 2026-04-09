import { auth } from "@clerk/nextjs/server";
import DashboardShell from "@/components/dashboard-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
    const { userId } = await auth();

    if (!userId) {
        redirect("/");
    }

    return (
        <DashboardShell>
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white mb-1">Account Settings</h2>
                    <p className="text-slate-400">Manage your account preferences and security.</p>
                </div>

                <div className="grid gap-6">
                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-white">Profile Information</CardTitle>
                            <CardDescription className="text-slate-400">
                                Update your personal details.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-300">Email Address</Label>
                                <Input
                                    id="email"
                                    value="user@example.com"
                                    readOnly
                                    className="bg-slate-800 border-slate-700 text-slate-400"
                                />
                                <p className="text-xs text-slate-500">Email is managed via Clerk authentication.</p>
                            </div>
                            <Button className="bg-indigo-600 hover:bg-indigo-500">
                                Save Changes
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-white text-red-400">Danger Zone</CardTitle>
                            <CardDescription className="text-slate-400">
                                Irreversible actions for your account.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="destructive" className="bg-red-900/20 text-red-400 border border-red-900/50 hover:bg-red-900/40">
                                Delete Account
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardShell>
    );
}
