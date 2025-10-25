"use client";

import {Bell01, SearchLg, Settings01} from "@untitledui/icons";
import {Button as AriaButton, DialogTrigger, Popover } from "react-aria-components";
import {Avatar} from "@/components/base/avatar/avatar";
import {Input} from "@/components/base/input/input";
import {cx} from "@/utils/cx";
import {MobileNavigationHeader} from "./base-components/mobile-header";
import {NavAccountMenu} from "./base-components/nav-account-card";
import {NavItemBase} from "./base-components/nav-item";
import {NavItemButton} from "./base-components/nav-item-button";
import {NavList} from "./base-components/nav-list";
import {GradeflowLogo} from "@/components/foundations/logo/gradeflow-logo";
import clsx from "clsx";
import NotificationsList from "@/components/NotificationsList";
import {useEffect, useState} from "react";
import {collection, onSnapshot, orderBy, query, where} from "firebase/firestore";
import {db} from "@/utils/firebase";
import {Tooltip, TooltipTrigger} from "@/components/base/tooltip/tooltip";

export const HeaderNavigationBase = ({
                                         user,
                                         activeUrl,
                                         items,
                                         subItems,
                                         trailingContent,
                                         showAvatarDropdown = true,
                                         hideBorder = false,
                                     }) => {
    const activeSubNavItems = subItems || items.find((item) => item.current && item.items && item.items.length > 0)?.items;

    const showSecondaryNav = activeSubNavItems && activeSubNavItems.length > 0;

    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (!user) return;

        const q = query(
            collection(db, "notifications"),
            where("recipientId", "==", user.uid),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            setNotifications(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        });

        return unsubscribe;
    }, [user]);

    const hasUnreadNotifications = () => {
        return notifications.some((notification) => !notification.read);
    }

    return (
        <>
            <MobileNavigationHeader>
                <aside
                    className="flex h-full max-w-full flex-col justify-between overflow-auto border-r border-secondary bg-primary pt-4 lg:pt-6">
                    <div className="flex flex-col gap-5 px-4 lg:px-5">
                        <GradeflowLogo className="h-8"/>
                    </div>

                    <NavList items={items}/>

                    { user &&
                        <div className="mt-auto flex flex-col gap-4 px-2 py-4 lg:px-4 lg:py-6">
                            <div className="flex flex-col gap-1">
                                <NavItemBase
                                    type="link"
                                    href="#"
                                    icon={Settings01}
                                >
                                    Settings
                                </NavItemBase>
                                <NavItemBase
                                    type="link"
                                    href="#"
                                    icon={Bell01}
                                >
                                    Notifications
                                </NavItemBase>
                                <NavItemBase
                                    type="link"
                                    href="#"
                                >
                                    <div className="flex items-center gap-2">
                                        <Avatar alt={`${user.displayName || user.email}`}
                                                src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
                                                size="md"/>
                                        <div>
                                            <p className="text-primary text-sm font-semibold">{user}</p>
                                            <p className="truncate text-tertiary text-sm">{user.displayName || user.email}</p>
                                        </div>
                                    </div>
                                </NavItemBase>
                            </div>
                        </div>
                    }
                </aside>
            </MobileNavigationHeader>

            <header className="max-lg:hidden">
                <section
                    className={cx(
                        "flex h-16 w-full items-center justify-center bg-primary md:h-18",
                        (!hideBorder || showSecondaryNav) && "border-b border-secondary",
                    )}
                >
                    <div className="flex w-full max-w-container justify-between pr-3 pl-4 md:px-8">
                        <div className="flex flex-1 items-center gap-4">
                            <a
                                aria-label="Go to homepage"
                                href="/"
                                className="rounded-xs outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2"
                            >
                                <GradeflowLogo className="h-8"/>
                            </a>

                            <nav>
                                <ul className="flex items-center gap-0.5">
                                    {items.map((item) => (
                                        <li key={item.label} className="py-0.5">
                                            <NavItemBase icon={item.icon} href={item.href} current={item.current}
                                                         badge={item.badge} type="link">
                                                {item.label}
                                            </NavItemBase>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </div>

                        { user &&
                            <div className="flex items-center gap-1">
                                {trailingContent}

                                <div className="flex gap-0.5">
                                    <NavItemButton
                                        current={activeUrl === "/settings"}
                                        size="md"
                                        icon={Settings01}
                                        label="Settings"
                                        href="/settings"
                                        tooltipPlacement="bottom"
                                    />
                                </div>

                                <DialogTrigger>
                                    <NavItemButton
                                        size="md"
                                        icon={Bell01}
                                        label="Notifications"
                                        tooltipPlacement="bottom"
                                        className={clsx(
                                        hasUnreadNotifications() ? "text-blue-500" : "text-fg-quaternary",
                                    )}
                                    />
                                    <Popover
                                        placement="bottom right"
                                        offset={8}
                                        className={({isEntering, isExiting}) =>
                                            cx(
                                                "will-change-transform",
                                                isEntering &&
                                                "duration-300 ease-out animate-in fade-in placement-right:slide-in-from-left-2 placement-top:slide-in-from-bottom-2 placement-bottom:slide-in-from-top-2",
                                                isExiting &&
                                                "duration-150 ease-in animate-out fade-out placement-right:slide-out-to-left-2 placement-top:slide-out-to-bottom-2 placement-bottom:slide-out-to-top-2",
                                            )
                                        }
                                    >
                                        <div
                                            className={"w-96 rounded-xl bg-secondary_alt shadow-lg ring ring-secondary_alt outline-hidden py-2 px-4"}
                                        >
                                            <NotificationsList notifications={notifications} />
                                        </div>
                                    </Popover>
                                </DialogTrigger>

                                {showAvatarDropdown && (
                                    <DialogTrigger>
                                        <AriaButton
                                            className={({isPressed, isFocused}) =>
                                                cx(
                                                    "group relative inline-flex cursor-pointer mx-1",
                                                    (isPressed || isFocused) && "rounded-full outline-2 outline-offset-2 outline-focus-ring",
                                                )
                                            }
                                        >
                                            <Avatar alt="Olivia Rhye"
                                                    src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
                                                    size="md"/>
                                        </AriaButton>
                                        <Popover
                                            placement="bottom right"
                                            offset={8}
                                            className={({isEntering, isExiting}) =>
                                                cx(
                                                    "will-change-transform",
                                                    isEntering &&
                                                    "duration-300 ease-out animate-in fade-in placement-right:slide-in-from-left-2 placement-top:slide-in-from-bottom-2 placement-bottom:slide-in-from-top-2",
                                                    isExiting &&
                                                    "duration-150 ease-in animate-out fade-out placement-right:slide-out-to-left-2 placement-top:slide-out-to-bottom-2 placement-bottom:slide-out-to-top-2",
                                                )
                                            }
                                        >
                                            <NavAccountMenu user={user}/>
                                        </Popover>
                                    </DialogTrigger>
                                )}
                            </div>
                        }
                    </div>
                </section>
            </header>
        </>
    );
};
