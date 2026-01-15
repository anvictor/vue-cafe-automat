import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Composable for responsive scaling of the coffee machine interface
 * Calculates scale factor to fit the fixed-size container into available viewport
 */
export function useResponsiveScale() {
  // Base dimensions matching the background image aspect ratio
  const BASE_WIDTH = 3238
  const BASE_HEIGHT = 1728

  const scaleFactor = ref(1)

  const calculateScale = () => {
    const container = document.querySelector('.main-content')
    if (!container) return

    const containerWidth = container.clientWidth
    const containerHeight = container.clientHeight

    // Calculate scale to fit container while maintaining aspect ratio
    const scaleX = containerWidth / BASE_WIDTH
    const scaleY = containerHeight / BASE_HEIGHT
    const scaleMin = scaleX < scaleY ? scaleX / scaleY : scaleY / scaleX;
    scaleFactor.value = scaleMin;
  }

  onMounted(() => {
    // Initial calculation
    calculateScale()

    // Recalculate on window resize
    window.addEventListener('resize', calculateScale)

    // Recalculate on device orientation change
    window.addEventListener('orientationchange', calculateScale)

    // Small delay to ensure DOM is ready
    setTimeout(calculateScale, 100)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', calculateScale)
    window.removeEventListener('orientationchange', calculateScale)
  })

  return {
    scaleFactor,
    BASE_WIDTH,
    BASE_HEIGHT
  }
}
