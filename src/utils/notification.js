export default class notify {
    constructor() {
        this.permision = 'default'
        this.msg = '您有一条消息，请查收'
    }

    getPermision() {
        window.Notification.requestPermission().then(res => {
            this.permision = res || 'default'
        })
    }

    popNotify(config) {
        const {
            title,
            body,
            icon,
            callback
        } = config;
        if (Notification.permission == 'granted' || this.permision == 'granted') {
            var notification = new Notification(title, {
                body,
                icon
            });

            notification.onclick = function () {
                if (typeof callback === 'function') callback();
                notification.close();
            };
        }
    }
}