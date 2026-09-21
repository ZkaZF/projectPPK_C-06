export function validateSlot(startTime,endTime){
	const errors = [];
	const [sH,sM] = startTime.split(':').map(Number);
	const [eH,eM] = endTime.split(':').map(Number);
	const startMin = sH*60+sM;
	const endMin = eH*60+eM;

	if(sH < 7 || eh > 20 || (eH === 20 && eM > 0)){
		errors.push('Waktu harus dalam jam operasional (07:00-20:00)');
	}
	if(sM % 30 !== 0 || eM % 30 !== 0){
		errors.push('Waktu harus kelipatan 30 menit');
	}
	if(startMin >= endMin){
		errors.push('Waktu selesai tidak bisa mendahului waktu mulai');
	}
	return errors;
}
