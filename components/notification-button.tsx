import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import { auth } from "auth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "./ui/dropdown-menu"
//import { Bell, User } from 'lucide-react'
import CustomLink from "./custom-link"
import {
	HamburgerMenuIcon,
	DotFilledIcon,
	BellIcon,
	ChevronRightIcon,
} from "@radix-ui/react-icons";
import { SignIn, SignOut } from "./auth-components"

export default async function NotificationButton() {
  const session = await auth()
  if (!session?.user) return <SignIn />
  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <span style={{ color: "grey"}}><BellIcon color={'red'}/>
         </span> </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
                notifications 
            </div>
          </DropdownMenuLabel>

          <DropdownMenuItem>
        <CustomLink href="/settings">recived Notification for you</CustomLink>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
