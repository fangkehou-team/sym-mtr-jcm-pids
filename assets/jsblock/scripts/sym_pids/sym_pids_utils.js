importPackage(org.mtr.core.tool)

let pids_origin_width = 1920;
let pids_origin_height = 1080;

function calculateWidth(pids_size, width) {
    let scaleFactor = pids_origin_width / pids_size.width;
    return width / scaleFactor;
}

function calculateHeight(pids_size, height) {
    let scaleFactor = pids_origin_height / pids_size.height;
    return height / scaleFactor;
}

function calculateCenterWidth(pids_size, rtwidth, width) {
    let realwidth = rtwidth + width / 2;
    let scaleFactor = pids_origin_height / pids_size.height;
    return realwidth / scaleFactor;
}

function calculateCenterHeight(pids_size, rtheight, height) {
    let realheight = rtheight + height / 2;
    let scaleFactor = pids_origin_height / pids_size.height;
    return realheight / scaleFactor;
}

function calculateRightWidth(pids_size, rtwidth, width) {
    let realwidth = rtwidth + width;
    let scaleFactor = pids_origin_height / pids_size.height;
    return realwidth / scaleFactor;
}

function calculateRightHeight(pids_size, rtheight, height) {
    let realheight = rtheight + height;
    let scaleFactor = pids_origin_height / pids_size.height;
    return realheight / scaleFactor;
}

function calculateTime() {
    let current_time = new Date()
    let hours = current_time.getHours()
    let minutes = current_time.getMinutes()
    let seconds = current_time.getSeconds()
    let time = hours.toString().padStart(2, '0') + ":" + minutes.toString().padStart(2, '0') + ":" + seconds.toString().padStart(2, '0');

    let day = current_time.getDate();
    let month = current_time.getMonth() + 1;
    let date = day.toString().padStart(2, '0') + "/" + month.toString().padStart(2, '0');

    let weekDay = current_time.getDay();
    const days = [
        {cn: "周日", en: "Sun"},
        {cn: "周一", en: "Mon"},
        {cn: "周二", en: "Tue"},
        {cn: "周三", en: "Wed"},
        {cn: "周四", en: "Thu"},
        {cn: "周五", en: "Fri"},
        {cn: "周六", en: "Sat"}
    ];
    let week = `${days[weekDay].cn}/${days[weekDay].en}`;


    return {
        time,
        date,
        week,
    }
}

function calculateArriving(eta) {
    let eta_minute = Math.round((eta - Date.now()) / 60000);
    if (eta_minute < 0) {
        eta_minute = 0
    }
    return eta_minute
}

function drawCongestion(ctx, pids_size, congestion_level, width, height) {
    let congestion = [
        () => {
            return Texture.create("congestion_empty")
                .texture("jsblock:custom_directory/sym_pids/congestion/empty.png")
                .size(calculateWidth(pids_size, 47.686), calculateHeight(pids_size, 52.981))
        },
        () => {
            return Texture.create("congestion_medium")
                .texture("jsblock:custom_directory/sym_pids/congestion/medium.png")
                .size(calculateWidth(pids_size, 47.686), calculateHeight(pids_size, 52.981))
        },
        () => {
            return Texture.create("congestion_full")
                .texture("jsblock:custom_directory/sym_pids/congestion/full.png")
                .size(calculateWidth(pids_size, 47.686), calculateHeight(pids_size, 52.981))
        },
    ]

    if (congestion_level == 0) {
        congestion[0]()
            .pos(width, height)
            .draw(ctx)
    }

    if (congestion_level == 1) {
        congestion[1]()
            .pos(width, height)
            .draw(ctx)
    }

    if (congestion_level == 2) {
        congestion[2]()
            .pos(width, height)
            .draw(ctx)
    }

}

function fetchTwoFirstArrivals(arrivals) {
    let arrival_first = arrivals.get(0);
    let arrival_second = null;
    let pos = 1;

    do {
        let temp_arrival = arrivals.get(pos);
        if (temp_arrival.platformId() != arrival_first.platformId()) {
            arrival_second = temp_arrival;
        }
        pos++
    } while (arrivals.get(pos) == null)

    return [arrival_first, arrival_second];
}

const default_config = {
    video: {
        path: "jsblock:custom_directory/sym_pids/sym_video/sym_video_{}.png",
        size: 132,
        rate: 10
    },
    logo: {
        path: "jsblock:custom_directory/sym_logo.png"
    },
    text: {
        welcome: "欢迎乘坐沈阳地铁4号线 Welcome to Shenyang Metro Line 4",
        announcement: "乘客在乘坐沈阳地铁时，同一行程进出站时需使用同一支付方式，混刷将导致重复扣费，混刷包括：不同APP生成的乘车二维码混刷；乘车二维码或人脸与单程票、盛京通卡、银联卡闪付等实体卡混刷；除盛京通APP乘车二维码与人脸，在乘客开通乘车二维码和刷脸乘车功能时，使用同一注册手机号情况下可以混合使用外，其他乘车二维码与人脸混刷等。"
    },
    congestion: [0, 0, 0, 0, 0, 0]
}

const default_custom_config = {
    custom_message: [
        "",
        "",
        "",
        ""
    ]
}

function fetchConfig(pids) {
    let config = Resources.readString(Resources.id("jsblock:sym_pids_global_config.json"));

    if (config) {
        config = JSON.parse(config);
    } else {
        config = default_config;
    }

    mergeObjects(default_config, config);
    let custom_config = default_custom_config;
    custom_config.custom_message = [
        pids.getCustomMessage(0),
        pids.getCustomMessage(1),
        pids.getCustomMessage(2),
        pids.getCustomMessage(3)
    ];
    mergeObjects(custom_config, config);

    return config;
}


function mergeObjects(source, target) {
    for (let key in source) {
        if (source.hasOwnProperty(key)) {
            if (typeof source[key] === 'object' && !Array.isArray(source[key])) {
                if (!target[key]) {
                    target[key] = {};
                }
                mergeObjects(source[key], target[key]);
            } else {
                if (!target.hasOwnProperty(key)) {
                    target[key] = source[key];
                }
            }
        }
    }
}

