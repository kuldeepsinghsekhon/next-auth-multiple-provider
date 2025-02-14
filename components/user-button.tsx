import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import { auth } from "auth"
import CustomLink from "./custom-link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal
} from "./ui/dropdown-menu"
import {
	HamburgerMenuIcon,
	DotFilledIcon,
	BellIcon,
	ChevronRightIcon,
} from "@radix-ui/react-icons";
import { SignIn, SignOut } from "./auth-components"

export default async function UserButton() {
  const session = await auth()
  if (!session?.user) return <SignIn />
  return (
    <div className="flex items-center gap-2">
      <span className="hidden text-sm sm:inline-flex">
        {session.user.email}
      </span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={
                  session.user.image ??
                  `https://api.dicebear.com/9.x/thumbs/svg?seed=${Math.floor(Math.random() * 100000) + 1}&randomizeIds=true`
                }
                alt={session.user.name ?? ""}
              />
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {session.user.name}
              </p>
              <p className="text-muted-foreground text-xs leading-none">
                {session.user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
        <CustomLink href="/settings/account">Settings</CustomLink>
          
          </DropdownMenuItem>
        <DropdownMenuItem>Support</DropdownMenuItem>
        <DropdownMenuSub>
						<DropdownMenuSubTrigger className="DropdownMenuSubTrigger">
							More Tools
							<div className="RightSlot">
								<ChevronRightIcon />
							</div>
						</DropdownMenuSubTrigger>
						<DropdownMenuPortal>
							<DropdownMenuSubContent
								className="DropdownMenuSubContent"
								sideOffset={2}
								alignOffset={-5}
							>
								<DropdownMenuItem className="DropdownMenuItem">
									Save Page As… <div className="RightSlot">⌘+S</div>
								</DropdownMenuItem>
								<DropdownMenuItem className="DropdownMenuItem">
									Create Shortcut…
								</DropdownMenuItem>
								<DropdownMenuItem className="DropdownMenuItem">
									Name Window…
								</DropdownMenuItem>
								<DropdownMenuSeparator className="DropdownMenu.Separator" />
								<DropdownMenuItem className="DropdownMenuItem">
									Developer Tools
								</DropdownMenuItem>
							</DropdownMenuSubContent>
						</DropdownMenuPortal>
					</DropdownMenuSub>

          <DropdownMenuItem>
            <SignOut />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
