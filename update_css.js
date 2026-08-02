const fs = require('fs');
const path = 'src/app/globals.css';
let content = fs.readFileSync(path, 'utf8');

const regex = /\.projects-radar-wrap \{[\s\S]*?(?=\/\* ============================================|\@media \(max-width: 767px\))/;

const newCss = .projects-radar-wrap {
  width: min(22rem, calc(100vw - 2rem));
  display: flex;
  justify-content: center;
  perspective: 1000px;
}

.projects-radar {
  position: relative;
  width: 14rem;
  height: 4.8rem;
  border-top-left-radius: 120px;
  border-top-right-radius: 120px;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  text-decoration: none;
  background: linear-gradient(180deg, rgba(5, 16, 24, 0.4), rgba(7, 25, 36, 0.95));
  border: 1px solid rgba(125, 231, 255, 0.15);
  border-bottom: none;
  backdrop-filter: blur(12px);
  box-shadow:
    0 -10px 40px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.projects-radar::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, rgba(255, 255, 255, 0) 0%, rgba(103, 232, 249, 0.15) 50%, rgba(255, 255, 255, 0) 100%);
  transform: translateX(-150%);
  transition: transform 0.8s ease;
  pointer-events: none;
  z-index: 0;
}

.projects-radar.is-hovered {
  width: 16rem;
  height: 5.5rem;
  border-color: rgba(125, 231, 255, 0.35);
  box-shadow:
    0 -15px 50px rgba(0, 0, 0, 0.5),
    0 0 30px rgba(103, 232, 249, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
  background: linear-gradient(180deg, rgba(5, 16, 24, 0.6), rgba(7, 25, 36, 0.98));
}

.projects-radar.is-hovered::after {
  transform: translateX(150%);
}

.projects-radar-inner {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  overflow: hidden;
  padding-bottom: 0.8rem;
}

.projects-radar-ticks {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 100%;
  height: 100%;
  transform: translateX(-50%);
  pointer-events: none;
  z-index: 0;
  transform-origin: center bottom;
  animation: radarSweep 16s ease-in-out infinite alternate;
}

.projects-radar-tick {
  position: absolute;
  left: 50%;
  bottom: 0;
  width: 1px;
  height: 0.8rem;
  border-radius: 999px;
  background: linear-gradient(180deg, rgba(163, 248, 255, 0.9), rgba(34, 211, 238, 0.1));
  box-shadow: 0 0 10px rgba(34, 211, 238, 0.4);
  transform: rotate(var(--radar-angle)) translateY(-3.8rem);
  transform-origin: center 3.8rem;
  transition: transform 0.4s ease;
}

.projects-radar.is-hovered .projects-radar-tick {
  transform: rotate(var(--radar-angle)) translateY(-4.4rem);
  transform-origin: center 4.4rem;
  height: 0.9rem;
  background: linear-gradient(180deg, #fff, rgba(94, 243, 255, 0.3));
}

.projects-radar-tick.is-major {
  height: 1.1rem;
  width: 1.5px;
  background: linear-gradient(180deg, #fff, rgba(94, 243, 255, 0.4));
}

.projects-radar.is-hovered .projects-radar-tick.is-major {
  height: 1.25rem;
}

.projects-radar-copy {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  height: 1.5rem;
}

.projects-radar-label,
.projects-radar-title {
  position: absolute;
  bottom: 0;
  white-space: nowrap;
  font-family: var(--font-sora), var(--font-geist-sans), sans-serif;
  line-height: 1;
  text-align: center;
  transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.projects-radar-label {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(178, 250, 255, 0.9);
}

.projects-radar-title {
  font-size: 1.05rem;
  font-weight: 600;
  color: #fff;
  text-shadow: 0 0 15px rgba(103, 232, 249, 0.4);
}

@keyframes radarSweep {
  0% { transform: translateX(-50%) rotate(-15deg); }
  100% { transform: translateX(-50%) rotate(15deg); }
}

;

content = content.replace(regex, newCss);

const mediaRegex = /@media \(max-width: 767px\) \{[\s\S]*?(?=\/\* ============================================)/;
const newMedia = @media (max-width: 767px) {
  .projects-radar-wrap {
    width: min(18rem, calc(100vw - 2rem));
  }

  .projects-radar {
    width: 12rem;
    height: 4.2rem;
  }

  .projects-radar.is-hovered {
    width: 13rem;
    height: 4.6rem;
  }

  .projects-radar-tick {
    transform: rotate(var(--radar-angle)) translateY(-3.2rem);
    transform-origin: center 3.2rem;
  }

  .projects-radar.is-hovered .projects-radar-tick {
    transform: rotate(var(--radar-angle)) translateY(-3.6rem);
    transform-origin: center 3.6rem;
  }
}

;

content = content.replace(mediaRegex, newMedia);

fs.writeFileSync(path, content);
console.log('done css');
