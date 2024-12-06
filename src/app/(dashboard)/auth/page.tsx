"use client"
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
})
export default function Auth() {
    const form = useForm()

    function onSubmit(values: z.infer<typeof formSchema>) {

        console.log(values)
    }
    return (
        <div className="w-screen h-screen ">
            <div className=" w-full h-full flex justify-between ">
                <div className="left flex-[1]  flex flex-col">
                    <div className="leftTop flex-[1]  flex items-center justify-center font-medium text-2xl">
                        <h1 className="heading">Setup your admin account</h1>
                    </div>
                    <Separator />
                    <div className="leftBottom flex-[4] w-[70%] m-auto pt-16">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                {/* name Section */}
                                <div className="nameSection flex justify-between space-x-2">

                                    <FormField

                                        control={form.control}
                                        name="username"
                                        render={({ field }) => (
                                            <FormItem className="w-1/2">
                                                <FormLabel className="font-light">First Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Type here..." {...field} />
                                                </FormControl>

                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField

                                        control={form.control}
                                        name="username"
                                        render={({ field }) => (
                                            <FormItem className="w-1/2">
                                                <FormLabel className="font-light">Last Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Type here..." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                {/* email section */}
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-light">Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Type here..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {/* password Section */}
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-light">Set Password</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Type new password here..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-light">Confirm Password</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Re-type new password here..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full p-3 bg-black">Next</Button>
                            </form>
                        </Form>
                    </div>
                </div>
                <div className="right flex-[1] bg-[#EFEAE0]">
                    <h1>Hey</h1>
                </div>
            </div>

        </div>
    )
}
