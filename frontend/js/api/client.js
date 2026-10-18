/**
 * UIForge API Client
 * FastAPI serveri bilan muloqot qiluvchi barcha so'rovlar shu yerda saqlanadi.
 */
// Dinamik API manzili (localhostda ham, AWS serverida ham avtomatik ishlaydi)
const API_BASE_URL = '/components';

export async function fetchDropdownOptions() {
  const response = await fetch(`${API_BASE_URL}/dropdown/options`);
  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status}`);
  }
  return response.json();
}

export async function fetchDropdownInspect(selectedOption) {
  const url = `${API_BASE_URL}/dropdown/inspect?selected_option=${encodeURIComponent(selectedOption)}`;
  const startTime = performance.now();
  
  const response = await fetch(url);
  const data = await response.json();
  const duration = Math.round(performance.now() - startTime);

  return {
    url,
    status: response.status,
    duration,
    telemetry: data.telemetry,
    responseData: data.response_data
  };
}
