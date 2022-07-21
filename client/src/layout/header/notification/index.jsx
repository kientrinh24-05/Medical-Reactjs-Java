import { Badge, Dropdown } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NotificationList from './list';
import messaging, { firebaseKey } from "@/utils/firebase";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useUserActions, useNotificationActions } from "@/_actions";
var sound = document.getElementById("notification-sound");
import request from "@/utils/request";
import { isSupported, onMessage, getToken } from "firebase/messaging";

const Notification = ({ className }) => {

    const navigate = useNavigate();
    const [isAllow, setIsAllow] = useState(true);
    const userActions = useUserActions();
    const actions = useNotificationActions();

    const gotoLink = (link) => {
        if (link && link != "/") {
            try {
                navigate(link);
            } catch (e) {
                location = request.url(link);
            }
        }
    };

    const playSound = () => {
        sound && sound.play();
    };

    const doAction = (notif) => {
        if (notif.action == "logout") {
            userActions.logout();
            navigate("/login");
        }
    };

    const initFirebase = async () => {
        if (await isSupported()) {
            console.log("supported");
            const token = await getToken(messaging, {
                validKey: firebaseKey,
            });
            setIsAllow(true);
            actions.sendToken({
                fcm_token: token,
            });

            // onBackgroundMessage(messaging, ({ data }) => {
            //     window.focus();
            // });

            onMessage(messaging, ({ data }) => {
                if (data.action) {
                    doAction(data);
                } else {
                    //todo push to notification list
                    playSound();

                    if (isAllow) {
                        var notif = new Notification(data.title, {
                            tag: data.id,
                            body: data.content,
                            icon: data.image,
                        });

                        notif.onclick = () => {
                            gotoLink(data.link);
                            actions.markAsRead(data.id);
                            notif.close();
                        };
                    }
                }
            });
        }
    };

    useEffect(() => {
        initFirebase();
    }, []);

    return (
        <div className="relative">
            <Dropdown trigger={["click"]} placement="bottom"  overlay={<NotificationList/>}>
                <span
                    className={"inline-block transition-all duration-300"}
                >
                    <Badge count={10} className={"text-base shadow-none"}>
                        <FontAwesomeIcon
                            className="text-white "
                            size="xl"
                            icon="fa-regular fa-bell"
                        />
                    </Badge>
                </span>
            </Dropdown>
        </div>
    );
};
export default Notification;
