import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      garage: [], // List of user's vehicles
      selectedVehicle: null, // Currently active vehicle for filtering/recommendations
      
      setUser: (user) => set({ user }),
      
      addVehicle: (vehicle) => {
        const newGarage = [...get().garage, { ...vehicle, id: Date.now().toString() }];
        set({ garage: newGarage });
        if (!get().selectedVehicle) {
          set({ selectedVehicle: newGarage[0] });
        }
      },
      
      removeVehicle: (id) => {
        const newGarage = get().garage.filter(v => v.id !== id);
        set({ garage: newGarage });
        if (get().selectedVehicle?.id === id) {
          set({ selectedVehicle: newGarage[0] || null });
        }
      },
      
      setSelectedVehicle: (vehicle) => set({ selectedVehicle: vehicle }),
      
      logout: () => set({ user: null, garage: [], selectedVehicle: null }),
    }),
    {
      name: 'user-storage',
    }
  )
);

export default useUserStore;
