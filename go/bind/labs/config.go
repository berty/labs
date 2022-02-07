package labs

type Config struct {
	HTMLModules     string
	GRPCAddr        string
	GRPCWebAddr     string
	HTMLModulesAddr string
}

func NewConfig() *Config {
	return &Config{
		GRPCWebAddr:     "127.0.0.1:9315",
		HTMLModulesAddr: "127.0.0.1:9316",
		HTMLModules:     "html-mods.bundle",
	}
}
