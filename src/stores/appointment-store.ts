import { create } from 'zustand'

type AppointmentData = {
    clientId: string | null
    serviceId: string | null
    professionalId: string | null
    date: string | null
    time: string | null
}

type AppointmentStore = AppointmentData & {
    // Setters individuais para cada campo
    setClientId: (id: string) => void
    setServiceId: (id: string) => void
    setProfessionalId: (id: string) => void
    setDate: (date: string) => void
    setTime: (time: string) => void

    // Getter para verificar se todos os dados estão preenchidos
    isComplete: () => boolean

    // Getter para obter todos os dados
    getAppointmentData: () => Partial<AppointmentData>

    // Reset
    reset: () => void
}

const initialState: AppointmentData = {
    clientId: null,
    serviceId: null,
    professionalId: null,
    date: null,
    time: null
}

export const useAppointmentStore = create<AppointmentStore>((set, get) => ({
    ...initialState,

    setClientId: (id) => set({ clientId: id }),
    setServiceId: (id) => set({ serviceId: id }),
    setProfessionalId: (id) => set({ professionalId: id }),
    setDate: (date) => set({ date }),
    setTime: (time) => set({ time }),

    isComplete: () => {
        const state = get()
        return Boolean(
            state.clientId &&
            state.serviceId &&
            state.professionalId &&
            state.date &&
            state.time
        )
    },

    getAppointmentData: () => {
        const state = get()
        return {
            clientId: state.clientId,
            serviceId: state.serviceId,
            professionalId: state.professionalId,
            date: state.date,
            time: state.time
        }
    },

    reset: () => set(initialState)
})) 