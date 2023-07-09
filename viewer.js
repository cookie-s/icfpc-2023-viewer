const eInput = document.getElementById('input');

const width = 1000;
const height = 1000;

const draw = SVG()
    .attr('class', 'is-fullwidth is-fullheight')
    .addTo('#canvas');

async function submit() {
    draw.clear();

    const problemId = parseInt(eInput.value);
    if(!(problemId > 0)) {
        throw 'invalid problem id';
    }
    const inputData = (await fetch(`input/problem-${problemId}.json`).then(e => e.text()));
    const input = JSON.parse(inputData);
    const outputData = (await fetch(`output/problem-${problemId}.json`).then(e => e.text()));
    const output = JSON.parse(outputData);

    const room = {
        width: input['room_width'],
        height: input['room_height'],
    };
    draw.attr('viewBox', `0 0 ${room.width} ${room.height}`)

    const stage = {
        width: input['stage_width'],
        height: input['stage_height'],
        x: input['stage_bottom_left'][0],
        y: input['stage_bottom_left'][1] - input['stage_height'],
    };

    // room
    draw.rect(0, 0)
        .size(room.width, room.height)
        .fill('#fff')
        .stroke('black');

    // stage
    draw.rect(0, 0)
        .size(stage.width, stage.height)
        .fill('#ddd');

    const pillars = input['pillars'];
    for(const pillar of pillars) {
        const {center: [x, y], radius} = pillar;
        draw.ellipse({cx: x, cy: y})
            .radius(radius, radius).fill('#f00');
    }

    const attendees = input['attendees'];
    for(const attendee of attendees) {
        const {x, y, _tastes} = attendee;
        draw.ellipse({cx: x, cy: y})
            .radius(20, 20).fill('#0f0');
    }

    const placements = output['placement'];
    for(const placement of placements) {
        const {x, y} = placement;
        draw.ellipse({cx: x, cy: y})
            .radius(20, 20).fill('#00f');
    }
}

async function init() {
    eInput.value = '1';

    await submit();
}

init();
