include(Resources.id("jsblock:scripts/pids_util.js"));
include(Resources.id("jsblock:scripts/sym_pids/sym_pids_utils.js"))

let noto_sans_fonts = Resources.getSystemFont("Noto Sans")

function create(ctx, state, pids) {

    state.pids_size = {
        width: pids.width,
        height: pids.height
    }

    let config = fetchConfig(pids)

    if (config.custom_message[0] != null && config.custom_message[0] != "") {
        config.logo.path = config.custom_message[0]
    }

    if (config.custom_message[1] != null && config.custom_message[1] != "") {
        let congestions = ("" + config.custom_message[1])
            .split("|")
            .map((value) => {
                value = parseInt(value);
                if (value > 2 || value < 0) {
                    return 0;
                } else {
                    return value;
                }
            })

        if (congestions.length > 5) {
            config.congestion = congestions;
        }
    }

    if (config.custom_message[2] != null && config.custom_message[2] != "") {
        config.text.announcement = "" + config.custom_message[2]
    }

    if (config.custom_message[3] != null && config.custom_message[3] != "") {
        let video_detail_custom = config.custom_message[3].split("|")
        if (video_detail_custom.length() > 1) {
            config.video.size = parseInt(video_detail_custom[0])
            config.video.path = "" + video_detail_custom[1]
        }
        if (video_detail_custom.length() > 2) {
            config.video.rate = parseInt(video_detail_custom[1])
            config.video.path = "" + video_detail_custom[2]
        }
    }

    state.config = config;
}

function renderVideo(ctx, pids_size, video, frame) {
    Texture.create("Video")
        .texture(video.path.replace(/{}/g, frame))
        .pos(calculateWidth(pids_size, 640), 0)
        .size(calculateWidth(pids_size, 1280), calculateHeight(pids_size, 930))
        .draw(ctx);
}

function drawArriving(ctx, pids_size, eta, height_start) {
    if (eta > 0) {
        Text.create("arrived_chinese")
            .text(eta + "分钟/Min")
            .color(0xffffff)
            .scale(1)
            .centerAlign()
            .pos(calculateCenterWidth(pids_size, 208.949, 222.101), calculateHeight(pids_size, height_start + 20.82))
            .size(calculateWidth(pids_size, 295.035), calculateHeight(pids_size, 67.499))
            .scaleXY()
            .draw(ctx);

    } else {
        Text.create("arrived_chinese")
            .text("已经到达")
            .color(0xffffff)
            .scale(1)
            .centerAlign()
            .pos(calculateCenterWidth(pids_size, 208.949, 222.101), calculateHeight(pids_size, height_start))
            .size(calculateWidth(pids_size, 295.035), calculateHeight(pids_size, 67.499))
            .scaleXY()
            .draw(ctx);

        Text.create("arrived_english")
            .text("Arrived")
            .color(0xffffff)
            .scale(1)
            .centerAlign()
            .pos(calculateCenterWidth(pids_size, 208.949, 222.101), calculateHeight(pids_size, height_start + 86.851))
            .size(calculateWidth(pids_size, 139.307), calculateHeight(pids_size, 29.531))
            .scaleXY()
            .draw(ctx);
    }
}

function render(ctx, state, pids) {
    let pids_size = state.pids_size

    if (state.config == null) {
        create(ctx, state, pids)
    }

    //render video
    if(state.lastVideoUpdated == null) {
        state.lastVideoUpdated = 0
        state.lastVideoFrame = 0
    }

    let video_config = state.config.video;
    let currentTimeMillis = Timing.currentTimeMillis()
    if (currentTimeMillis - state.lastVideoUpdated >= 1000 / video_config.rate) {
        state.lastVideoUpdated = currentTimeMillis
        state.lastVideoFrame = (state.lastVideoFrame + 1) % video_config.size
    }

    renderVideo(ctx, pids_size, video_config,state.lastVideoFrame + 1)

    //Background
    Texture.create("Background")
        .texture("jsblock:custom_directory/sym_pids/left/pids_platform_level_after4.png")
        .size(pids.width, pids.height)
        .draw(ctx);

    // time
    let time = calculateTime();

    Text.create("time")
        .text(time.time)
        .color(0xffffff)
        .scale(1)
        .centerAlign()
        .pos(calculateCenterWidth(pids_size, 95.456, 449.089), calculateHeight(pids_size, 50.000))
        .size(calculateWidth(pids_size, 449.089), calculateHeight(pids_size, 73.656))
        .scaleXY()
        .draw(ctx);

    let arrival_first = pids.arrivals().get(0);
    if (arrival_first != null) {
        // station names
        let station = arrival_first.destination();

        let main_station_name = "";
        let extra_station_name = "";
        if (TextUtil.isCjk(station)) {
            main_station_name = TextUtil.getCjkParts(station);
            extra_station_name = TextUtil.getNonCjkParts(station);
        } else {
            let station_names = TextUtil.getNonExtraParts(station).split("|");
            main_station_name = station_names[0];
            if (station_names.length() > 1) {
                extra_station_name = station_names[1];
            }
        }

        Text.create("main_station_name")
            .text(main_station_name)
            .color(0xffffff)
            .scale(1)
            .centerAlign()
            .pos(calculateCenterWidth(pids_size, 208.949, 222.101), calculateHeight(pids_size, 264.946))
            .size(calculateWidth(pids_size, 507.157), calculateHeight(pids_size, 68.843))
            .scaleXY()
            .draw(ctx);

        Text.create("extra_station_name")
            .text(extra_station_name)
            .color(0xffffff)
            .scale(1)
            .centerAlign()
            .pos(calculateCenterWidth(pids_size, 137.216, 365.568), calculateHeight(pids_size, 365.722))
            .size(calculateWidth(pids_size, 507.157), calculateHeight(pids_size, 56.672))
            .scaleXY()
            .draw(ctx);

        let eta = calculateArriving(arrival_first.arrivalTime());
        drawArriving(ctx, pids_size, eta, 559.473)
    }

    let arrival_second = pids.arrivals().get(1);
    if (arrival_second != null) {
        let eta = calculateArriving(arrival_second.arrivalTime());
        drawArriving(ctx, pids_size, eta, 772.473)
    }

    let congestion_config = state.config.congestion;
    congestion_config.forEach((level, index) => {
        drawCongestion(ctx, pids_size, level, calculateWidth(pids_size, 718.000 + 153.553 * index), calculateHeight(pids_size, 93.509))
    })

    // bottom roll
    let text_config = state.config.text;
    Text.create("bottom_row")
        .text(text_config.announcement)
        .color(0xffffff)
        .scale(0.8)
        // .centerAlign()
        .pos(calculateWidth(pids_size, 5), calculateHeight(pids_size, 941.075))
        .size(calculateWidth(pids_size, 1920 - 469.539) / 0.8, calculateHeight(pids_size, 95.907))
        .marquee()
        .draw(ctx);

    // logo
    let logo_config = state.config.logo;
    Texture.create("SYMLogo")
        .texture(logo_config.path)
        .pos(calculateWidth(pids_size, 1535.489), calculateHeight(pids_size, 941.075))
        .size(calculateWidth(pids_size, 379.539), calculateHeight(pids_size, 115.907))
        .draw(ctx);
}

function dispose(ctx, state, pids) {
}
