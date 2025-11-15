// prisma.config.ts (프로젝트 루트)
import 'dotenv/config'                    // ← 이 한 줄이 핵심: .env 로드
import { defineConfig } from '@prisma/config'

export default defineConfig({
  schema: './prisma/schema.prisma',       // 경로만 명시
})
