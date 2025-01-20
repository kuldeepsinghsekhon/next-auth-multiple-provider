import { MainNav } from "./main-nav"
import NotificationButton from "./notification-button"
import UserButton from "./user-button"

export default function Header() {
  return (
    <header className="sticky flex justify-center border-b">
      <div className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between px-4 sm:px-6">
        <MainNav />
        <NotificationButton/>
        <UserButton />
      </div>
    </header>
  )
}
