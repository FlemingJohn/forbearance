import { useEffect, useRef } from "react";
import { FRAGMENT_SHADER, VERTEX_SHADER } from "./shaderSource";
import { SHADER_UNIFORMS } from "./shaderUniforms";

interface ShaderBackgroundProps {
  className?: string;
}

export function ShaderBackground({ className }: ShaderBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const gl = canvas.getContext("webgl", { antialias: false });

    if (!gl) {
      return;
    }

    function compileShader(type: number, source: string) {
      const shader = gl!.createShader(type)!;
      gl!.shaderSource(shader, source);
      gl!.compileShader(shader);
      return shader;
    }

    const program = gl.createProgram()!;
    const vertexShader = compileShader(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );

    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const uniforms = {
      colors: gl.getUniformLocation(program, "u_colors"),
      scene: gl.getUniformLocation(program, "u_scene"),
      shape: gl.getUniformLocation(program, "u_shape"),
      surface: gl.getUniformLocation(program, "u_surface"),
      finish: gl.getUniformLocation(program, "u_finish"),
      transform: gl.getUniformLocation(program, "u_transform"),
      space: gl.getUniformLocation(program, "u_space"),
      cursor: gl.getUniformLocation(program, "u_cursor"),
    };

    gl.uniform3fv(
      uniforms.colors,
      new Float32Array(SHADER_UNIFORMS.colors.flat()),
    );
    gl.uniform4f(
      uniforms.shape,
      SHADER_UNIFORMS.scale,
      SHADER_UNIFORMS.intensity,
      SHADER_UNIFORMS.paramA,
      SHADER_UNIFORMS.warp,
    );
    gl.uniform4f(
      uniforms.surface,
      SHADER_UNIFORMS.detail,
      SHADER_UNIFORMS.contrast,
      SHADER_UNIFORMS.brightness,
      SHADER_UNIFORMS.saturation,
    );
    gl.uniform4f(
      uniforms.finish,
      SHADER_UNIFORMS.hue,
      SHADER_UNIFORMS.vignette,
      SHADER_UNIFORMS.blur,
      SHADER_UNIFORMS.grain,
    );
    gl.uniform4f(
      uniforms.transform,
      SHADER_UNIFORMS.seed,
      SHADER_UNIFORMS.rotate,
      SHADER_UNIFORMS.drift,
      SHADER_UNIFORMS.oklab,
    );
    gl.uniform4f(uniforms.cursor, 0, 0, 0, 0);

    let animationFrame = 0;
    let isDisposed = false;
    let isVisible = document.visibilityState === "visible";
    const startedAt = performance.now();

    function resizeCanvas() {
      const bounds = canvas!.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      const rawWidth = Math.max(1, Math.round(bounds.width * pixelRatio));
      const rawHeight = Math.max(1, Math.round(bounds.height * pixelRatio));
      const pixelScale = Math.min(
        1,
        Math.sqrt(2_000_000 / Math.max(1, rawWidth * rawHeight)),
      );
      const width = Math.max(1, Math.round(rawWidth * pixelScale));
      const height = Math.max(1, Math.round(rawHeight * pixelScale));

      if (canvas!.width !== width || canvas!.height !== height) {
        canvas!.width = width;
        canvas!.height = height;
        gl!.viewport(0, 0, width, height);
      }
    }

    function drawFrame(now: number) {
      animationFrame = 0;

      if (isDisposed || !isVisible) {
        return;
      }

      resizeCanvas();

      const elapsed = prefersReducedMotion ? 0 : (now - startedAt) / 1000;

      gl!.uniform4f(
        uniforms.scene,
        canvas!.width,
        canvas!.height,
        elapsed * SHADER_UNIFORMS.timeScale,
        SHADER_UNIFORMS.colorCount,
      );
      gl!.uniform4f(
        uniforms.space,
        SHADER_UNIFORMS.offsetX,
        SHADER_UNIFORMS.offsetY,
        0,
        0,
      );
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);

      if (!prefersReducedMotion) {
        animationFrame = requestAnimationFrame(drawFrame);
      }
    }

    function handleVisibilityChange() {
      isVisible = document.visibilityState === "visible";

      if (isVisible && animationFrame === 0) {
        animationFrame = requestAnimationFrame(drawFrame);
      }
    }

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();

      if (animationFrame === 0) {
        animationFrame = requestAnimationFrame(drawFrame);
      }
    });

    resizeObserver.observe(canvas);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    animationFrame = requestAnimationFrame(drawFrame);

    return () => {
      isDisposed = true;
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
      style={{ display: "block", width: "100%", height: "100%" }}
    />
  );
}
