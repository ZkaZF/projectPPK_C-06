// mock data yang mengikuti skema tabel 'facilities', lihat implementation_plan.md
// ganti ke api yang asli begitu orang ke 1 share response json

export const mockFacilityTypes = [
	{fac_type_id:1,fac_type_name:'ruang_kelas'},
	{fac_type_id:2,fac_type_name:'aula'},
	{fac_type_id:3,fac_type_name:'laboratorium'},
	{fac_type_id:4,fac_type_name:'alat'},
	{fac_type_id:5,fac_type_name:'lapangan'},
];

export const mockFacilities = [
	{
		fac_id:1,
		fac_name:'Aula Serbaguna Lantai 3',
		fac_type:{fac_type_id:2,fac_type_name:'aula'},
		fac_location:'Gedung A, lantai 3',
		fac_capacity:150,
		fac_description:'Aula untuk acara besar, seminar, dan wisuda.',
		fac_status:{fac_stat_id:1,fac_status_name:'aktif'},
		fac_image:null,
	},
	{
		fac_id:2,
		fac_name:'Lab Komputer 2',
		fac_type:{fac_type_id:3,fac_type_name:'laboratorium'},
		fac_location:'Gedung B, Lantai 1',
		fac_capacity:40,
		fac_description:'Lab dengan 40 unit PC untuk praktikum.',
		fac_status:{fac_stat_id:1,fac_status_name:'aktif'},
		fac_image:null,
	},
	{
		fac_id:3,
		fac_name:'Lapangan Basket Outdoor',
		fac_type:{fac_type_id:5,fac_type_name:'lapangan'},
		fac_location:'Area Belakang Kampus',
		fac_capacity:null,
		fac_description:'Lapangan basket standar, bisa dipakai malam hari.',
		fac_status:{fac_stat_id:5,fac_status_name:'dalam_perbaikan'},
		fac_image:null,
	},
	{
		fac_id:4,
		fac_name:'Ruang Kelas 2.1',
		fac_type:{fac_type_id:1,fac_type_name:'ruang_kelas'},
		fac_location:'Gedung C, Lantai 2',
		fac_capacity:40,
		fac_description:'Ruang kelas standar dengan proyektor.',
		fac_status:{fac_stat_id:1,fac_status_name:'aktif'},
		fac_image:null,
	},
];

export function getMockFacilityById(id){
	return mockFacilities.find((f) => String(f.fac_id) === String(id)) || null;
}

//method yang generate slot per 30 menit untuk 1 fasilitas 

export function mockSlots(facId,date){
	const slots = [];
	for(let h = 7; h<20;h++){
		for(const m of [0,30]){
			const start = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
			const endH = m === 30 ? h + 1 : h;
			const endM = m === 30 ? 0 : 30;
			const end = `${String(endH).padStart(2,'0')}:${String(endM).padStart(2,'0')}`;
			slots.push({start,end,status:Math.random()>0.8 ? 'booked' : 'available',});
		}
	}
	return slots;
}
