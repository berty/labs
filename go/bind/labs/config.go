package labs

type Config struct {
	Address     string
	HTMLModules string
}

func NewConfig() *Config {
	return &Config{
		Address:     "127.0.0.1:9315",
		HTMLModules: "html-mods.bundle",
	}
}
