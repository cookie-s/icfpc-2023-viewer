const draw = SVG()
    .attr('class', 'is-fullwidth is-fullheight')
    .addTo('#canvas');

async function _submit({problem_id}) {
    draw.clear();

    const problemId = problem_id;
    if(!(problemId > 0)) {
        throw 'invalid problem id';
    }
    const inputData = await fetch(`../input/problem-${problemId}.json`).then(e => e.text());
    const input = JSON.parse(inputData);
    const outputData = await fetch(`../output/problem-${problemId}.json`)
        .then(r => {
            if(!r.ok) throw 'err';
            return r.text();
        })
        .catch(_ => '{"placements":[], "volumes":[]}');
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
        y: input['stage_bottom_left'][1],
    };

    // room
    draw.rect(room.width, room.height)
        .fill('#fff')
        .stroke('black');

    // stage
    draw.rect(stage.width, stage.height)
        .move(stage.x, stage.y)
        .fill('#ddd');

    const pillars = input['pillars'];
    for(const pillar of pillars) {
        const {center: [x, y], radius} = pillar;
        draw.circle({cx: x, cy: y})
            .radius(radius).fill('#f00');
    }

    const attendees = input['attendees'];
    for(const attendee of attendees) {
        const {x, y, _tastes} = attendee;
        draw.circle({cx: x, cy: y})
            .radius(5).fill('#0f0');
    }

    const placements = output['placements'];
    const volumes = output['volumes'];
    for (let i = 0; i < placements.length; i++) {
        const {x, y} = placements[i];
        const volume = volumes[i];

        draw.circle({cx: x, cy: y})
            .radius(10)
            .fill(`rgba(0, 0, 255, ${(1+volume)/20})`);
    }
}

const app = new Vue({
    el: '#app',
    data: {
        tab: 'room',
        room_problemid: 1,
    },
    mounted() {
        this.submit();
    },
    methods: {
        async submit() {
            console.log(this.room_problemid);
            await _submit({
                problem_id: this.room_problemid,
            });
        },
        updateTab(tab) {
            this.tab = tab;
            if(tab === 'room') {
                document.getElementById('canvas').classList.remove('is-hidden');
            } else {
                document.getElementById('canvas').classList.add('is-hidden');
            }
        }
    }
});
