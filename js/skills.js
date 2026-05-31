const buttonWidth = 250;
const buttonHeight = 50;
const buttons = [
    { id: 'hp', text: 'zvyš HP', x: 0, y: 0 },
    { id: 'speed', text: 'Vylepšit Rychlost', x: 0, y: 0 },
    { id: 'size', text: 'Vylepšit Velikost schopností', x: 0, y: 0 },
    { id: 'lavaPool', text: 'Odemknout Lávovou kaluž', x: 0, y: 0 },
    { id: 'fireBall', text: 'Odemknout Fireball', x: 0, y: 0 },
    { id: 'laser', text: 'odemknout laser', x: 0, y: 0 },
    { id: 'wall', text: 'Odemknout Kamennou zeď', x: 0, y: 0 },
    { id: 'poison', text: 'Odemknout Jed', x: 0, y: 0 },
    { id: 'damage', text: 'Zvýšit poškození o 10%', x: 0, y: 0},
    { id: 'haste', text: 'Zrychlit schopnosti o 10%', x: 0, y: 0 },
    { id: 'circleOfFire', text: 'ULT: Kruh Ohně (Láva + Fireball)', x: 0, y: 0 },
    { id: 'laserWall', text: 'ULT: Laserová Klec (Laser + Zeď)', x: 0, y: 0 },
];
let selectedSkills = [];

// Function: chooseTreeSkills — pick a small set of available skill choices
function chooseTreeSkills(player, lavaPool, laser, fireBall, wall) {
    const isFirstChoice = player.skills.length === 0;
    const available = buttons.filter(btn => {
        if (isFirstChoice) {
            return ['lavaPool', 'fireBall', 'laser', 'poison'].includes(btn.id);
        }

        if (['hp', 'speed', 'size', 'damage', 'haste'].includes(btn.id)) {
            return true; 
        }

        if (btn.id === 'lavaPool') {
            return !lavaPool || lavaPool.level < 3;
        }
        if (btn.id === 'laser') {
            return !laser || laser.level < 3;
        }
        if (btn.id === 'fireBall') {
            return !fireBall || fireBall.level < 3;
        }
        if (btn.id === 'wall') {
            return !wall || wall.level < 3;
        }
        if (btn.id === 'circleOfFire') {
            return lavaPool && lavaPool.level >= 3 
                && fireBall && fireBall.level >= 3
                && !player.skills.includes('circleOfFire');
        }
        if (btn.id === 'laserWall') {
            return laser && laser.level >= 3 
                && wall && wall.level >= 3
                && !player.skills.includes('laserWall');
        }

        const isNewActiveSkill = ['lavaPool', 'fireBall', 'laser', 'wall', 'poison'].includes(btn.id) && !player.skills.includes(btn.id);
        if (isNewActiveSkill && player.skills.length >= 3) {
            return false;
        }

        return !player.skills.includes(btn.id);
    });

  const result = [];
  const usedIndexes = new Set();

  const count = Math.min(3, available.length);

  while (result.length < count) {
    const randIndex = Math.floor(Math.random() * available.length);

    if (!usedIndexes.has(randIndex)) {
      usedIndexes.add(randIndex);
      result.push(available[randIndex]);
    }
  }

  return result;
}

// Function: drawSkillsChoice — display skill selection UI on canvas
export function drawSkillsChoice(ctx, canvas, player, lavaPool, laser, fireBall, wall) {
     if (selectedSkills.length === 0) {
        selectedSkills = chooseTreeSkills(player, lavaPool, laser, fireBall, wall);
    }
    const centerX = canvas.width / 2 - buttonWidth / 2;
    const centerY = canvas.height / 2 - (selectedSkills.length * (buttonHeight + 10)) / 2;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillRect(centerX - 20, centerY - 40, buttonWidth + 40, (selectedSkills.length * (buttonHeight + 10)) + 60);

    ctx.fillStyle = '#fff';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Vyberte si vylepšení:', canvas.width / 2, centerY - 15);

    selectedSkills.forEach((btn, index) => {
        btn.x = centerX;
        btn.y = centerY + index * (buttonHeight + 10);

        ctx.fillStyle = '#34495e';
        ctx.fillRect(btn.x, btn.y, buttonWidth, buttonHeight);

        ctx.fillStyle = '#fff';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(btn.text, btn.x + buttonWidth / 2, btn.y + buttonHeight / 2);
    });
}

// Function: handleSkillsClick — process clicks for skill selection
export function handleSkillsClick(mouseX, mouseY, player, lavaPool, laser, fireBall, wall) {
    for (const btn of selectedSkills) {
        if (mouseX >= btn.x && mouseX <= btn.x + buttonWidth &&
            mouseY >= btn.y && mouseY <= btn.y + buttonHeight) {
            
            console.log(`Vybráno: ${btn.id}`);

            if (btn.id === 'hp') {
                player.maxHp += 20;
                player.HP += 20;
            } else if (btn.id === 'damage') {
                player.additionalDamage += 0.1;
            }else if (btn.id === 'speed') {
                player.speed += 0.1;
            } else if (btn.id === 'size') {
                player.abilityMultiplier += 0.1;
            } else if (btn.id === 'haste') {
                player.abilityHaste += 0.1;
            } else if (btn.id === 'lavaPool') {
                if (!player.skills.includes('lavaPool')) {
                    player.skills.push('lavaPool');
                } else {
                    if (lavaPool) {
                        lavaPool.level += 1;
                        console.log("Láva povýšila na level: " + lavaPool.level);
                    }
                }
            } else if (btn.id === 'laser') {
                if (!player.skills.includes('laser')) {
                    player.skills.push('laser');
                } else {
                    if (laser) {
                    laser.level += 1;
                    console.log("Laser povýšil na level: " + laser.level);
                    }
                }
            } else if (btn.id === 'fireBall') {
                if (!player.skills.includes('fireBall')) {
                    player.skills.push('fireBall');
                } else {
                    if (fireBall) {
                        fireBall.level += 1;
                        console.log("Ohňostroj povýšil na level: " + fireBall.level);
                    }
                }
            } else if (btn.id === 'wall') {
                if (!player.skills.includes('wall')) {
                    player.skills.push('wall');
                } else {
                    if (wall) {
                        wall.level += 1;
                        console.log("Zeď povýšila na level: " + wall.level);
                    }
                }
            } else if (btn.id === 'poison' && !player.skills.includes('poison')) {
                player.skills.push('poison');
            } else if (btn.id === 'circleOfFire') {
                if (!player.skills.includes('circleOfFire')) {
                    player.skills.push('circleOfFire');
                    player.skills = player.skills.filter(skill => skill !== 'lavaPool' && skill !== 'fireBall');
                }
            } else if (btn.id === 'laserWall') {
                if (!player.skills.includes('laserWall')) {
                    player.skills.push('laserWall');
                    player.skills = player.skills.filter(skill => skill !== 'laser' && skill !== 'wall');
                }
            }
            player.skillPoint--;
            selectedSkills = [];
            return true; 
        }
    }
    return false; 
}