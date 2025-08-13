// Objeto para almacenar el estado de todas las alarmas
const alarms = {
    1: { totalTime: 0, remainingTime: 0, interval: null, isRunning: false, finished: false },
    2: { totalTime: 0, remainingTime: 0, interval: null, isRunning: false, finished: false },
    3: { totalTime: 0, remainingTime: 0, interval: null, isRunning: false, finished: false }
};

/**
 * Inicia una alarma específica
 * @param {number} alarmNumber - Número de la alarma (1, 2, o 3)
 */
function startAlarm(alarmNumber) {
    const alarm = alarms[alarmNumber];
    
    if (alarm.finished) {
        resetAlarm(alarmNumber);
    }
    
    if (!alarm.isRunning) {
        if (alarm.remainingTime === 0) {
            // Configurar nueva alarma
            const hours = parseInt(document.getElementById(`alarm${alarmNumber}-hours`).value) || 0;
            const minutes = parseInt(document.getElementById(`alarm${alarmNumber}-minutes`).value) || 0;
            const seconds = parseInt(document.getElementById(`alarm${alarmNumber}-seconds`).value) || 0;
            
            const totalSeconds = hours * 3600 + minutes * 60 + seconds;
            
            if (totalSeconds === 0) {
                showNotification(`⚠️ La alarma ${alarmNumber} debe tener un tiempo mayor a 0`);
                return;
            }
            
            alarm.totalTime = totalSeconds;
            alarm.remainingTime = totalSeconds;
        }
        
        alarm.isRunning = true;
        alarm.interval = setInterval(() => updateAlarm(alarmNumber), 1000);
        updateDisplay(alarmNumber);
        updateButtons(alarmNumber);
        updateStatus(alarmNumber, 'Alarma en progreso...');
        showNotification(`✅ Alarma ${alarmNumber} iniciada`);
    }
}

/**
 * Pausa una alarma específica
 * @param {number} alarmNumber - Número de la alarma (1, 2, o 3)
 */
function stopAlarm(alarmNumber) {
    const alarm = alarms[alarmNumber];
    if (alarm.isRunning) {
        clearInterval(alarm.interval);
        alarm.isRunning = false;
        updateButtons(alarmNumber);
        updateStatus(alarmNumber, 'Alarma pausada');
        showNotification(`⏸️ Alarma ${alarmNumber} pausada`);
    }
}

/**
 * Reinicia una alarma específica
 * @param {number} alarmNumber - Número de la alarma (1, 2, o 3)
 */
function resetAlarm(alarmNumber) {
    const alarm = alarms[alarmNumber];
    clearInterval(alarm.interval);
    alarm.isRunning = false;
    alarm.remainingTime = 0;
    alarm.totalTime = 0;
    alarm.finished = false;
    updateDisplay(alarmNumber);
    updateButtons(alarmNumber);
    updateStatus(alarmNumber, 'Configurar tiempo y presionar Iniciar');
    showNotification(`🔄 Alarma ${alarmNumber} reiniciada`);
}

/**
 * Actualiza el contador de una alarma cada segundo
 * @param {number} alarmNumber - Número de la alarma (1, 2, o 3)
 */
function updateAlarm(alarmNumber) {
    const alarm = alarms[alarmNumber];
    
    if (alarm.remainingTime > 0) {
        alarm.remainingTime--;
        updateDisplay(alarmNumber);
        
        // Advertencia cuando quedan 10 segundos
        if (alarm.remainingTime === 10) {
            showNotification(`⚠️ ¡Alarma ${alarmNumber} terminará en 10 segundos!`);
        }
    } else {
        // Alarma terminada
        clearInterval(alarm.interval);
        alarm.isRunning = false;
        alarm.finished = true;
        updateDisplay(alarmNumber);
        updateButtons(alarmNumber);
        updateStatus(alarmNumber, '🔔 ¡ALARMA TERMINADA!');
        triggerAlarmFinished(alarmNumber);
    }
}

/**
 * Actualiza el display visual de una alarma
 * @param {number} alarmNumber - Número de la alarma (1, 2, o 3)
 */
function updateDisplay(alarmNumber) {
    const alarm = alarms[alarmNumber];
    const countdownElement = document.getElementById(`countdown${alarmNumber}`);
    
    const hours = Math.floor(alarm.remainingTime / 3600);
    const minutes = Math.floor((alarm.remainingTime % 3600) / 60);
    const seconds = alarm.remainingTime % 60;
    
    const display = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    countdownElement.textContent = display;
    
    // Actualizar clases CSS según el estado
    countdownElement.className = 'countdown-display';
    if (alarm.finished) {
        countdownElement.classList.add('countdown-finished');
    } else if (alarm.isRunning) {
        if (alarm.remainingTime <= 10 && alarm.remainingTime > 0) {
            countdownElement.classList.add('countdown-warning');
        } else {
            countdownElement.classList.add('countdown-active');
        }
    } else {
        countdownElement.classList.add('countdown-inactive');
    }
}

/**
 * Actualiza el estado de los botones según el estado de la alarma
 * @param {number} alarmNumber - Número de la alarma (1, 2, o 3)
 */
function updateButtons(alarmNumber) {
    const alarm = alarms[alarmNumber];
    const startBtn = document.getElementById(`start${alarmNumber}`);
    const stopBtn = document.getElementById(`stop${alarmNumber}`);
    
    if (alarm.finished) {
        startBtn.textContent = 'Reiniciar y Comenzar';
        stopBtn.disabled = true;
    } else if (alarm.isRunning) {
        startBtn.textContent = 'Corriendo...';
        startBtn.disabled = true;
        stopBtn.disabled = false;
    } else if (alarm.remainingTime > 0) {
        startBtn.textContent = 'Continuar';
        startBtn.disabled = false;
        stopBtn.disabled = true;
    } else {
        startBtn.textContent = 'Iniciar';
        startBtn.disabled = false;
        stopBtn.disabled = true;
    }
}

/**
 * Actualiza el mensaje de estado de una alarma
 * @param {number} alarmNumber - Número de la alarma (1, 2, o 3)
 * @param {string} message - Mensaje a mostrar
 */
function updateStatus(alarmNumber, message) {
    const statusElement = document.getElementById(`status${alarmNumber}`);
    const alarm = alarms[alarmNumber];
    
    statusElement.textContent = message;
    statusElement.className = 'status-message';
    
    if (alarm.finished) {
        statusElement.classList.add('status-finished');
    } else if (alarm.isRunning) {
        statusElement.classList.add('status-active');
    } else {
        statusElement.classList.add('status-inactive');
    }
}

/**
 * Activa todos los efectos cuando una alarma termina
 * @param {number} alarmNumber - Número de la alarma (1, 2, o 3)
 */
function triggerAlarmFinished(alarmNumber) {
    showNotification(`🚨 ¡ALARMA ${alarmNumber} TERMINADA! ¡Tiempo cumplido!`);
    
    // Reproducir sonido
    playAlarmSound();
    
    // Efecto visual en toda la página
    document.body.style.animation = 'blink 0.5s ease-in-out 8';
    
    setTimeout(() => {
        document.body.style.animation = '';
    }, 4000);
}

/**
 * Reproduce el sonido de alarma usando Web Audio API
 */
function playAlarmSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Crear una secuencia de 3 beeps
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);

                oscillator.frequency.value = 880; // Frecuencia del beep
                oscillator.type = 'sine';

                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.5);
            }, i * 600); // Espaciado de 600ms entre beeps
        }
    } catch (error) {
        console.log('Audio no disponible');
    }
}

/**
 * Muestra una notificación emergente
 * @param {string} message - Mensaje a mostrar en la notificación
 */
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 4000);
}

/**
 * Inicialización de la aplicación
 */
function initializeApp() {
    // Inicializar todas las alarmas
    for (let i = 1; i <= 3; i++) {
        updateDisplay(i);
        updateButtons(i);
    }
}

// Inicializar la aplicación cuando se carga la página
document.addEventListener('DOMContentLoaded', initializeApp);