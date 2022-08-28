let data = {
    popup: {
        popupId: '#popup',
        border: '#border',
        bg: {
            user: '#userBg',
            userName: '#userNameBg',
            team: "#teamBg",
            teamName: '#userTeamBg'
        }
    }
}

let app = {
    initialize: function () {
        let animation = new Animation(data.popup);
        view.setAnimationControls(animation);
    }
}

let view = {
    setAnimationControls: function (animation) {
        let btn = document.getElementById('btn');

        btn.addEventListener('click', () => {
            animation.restart();
        })
    }
}

function Animation(popup) {
    return new TimelineMax()
        .from(popup.border, 0.2, {
            ease: Power0.easeNone,
            scaleY: 0,
            opacity: 0,
            transformOrigin: 'bottom',
        })
        .from(popup.bg.user, 0.2, {
            ease: Power0.easeNone,
            scaleY: 0,
            opacity: 0,
            transformOrigin: 'left center',
        })
        .from(popup.bg.userName, 0.2, {
            ease: Power0.easeNone,
            scaleY: 0,
            opacity: 0,
            transformOrigin: 'left center',
        })
        .from(popup.bg.team, 0.2, {
            ease: Power0.easeNone,
            scaleY: 0,
            opacity: 0,
            transformOrigin: 'left center',
        })
        .from(popup.bg.teamName, 0.2, {
            ease: Power0.easeNone,
            scaleY: 0,
            opacity: 0,
            transformOrigin: 'left center',
        }).stop();
}

document.addEventListener("DOMContentLoaded", function(event) {
    app.initialize();
});
